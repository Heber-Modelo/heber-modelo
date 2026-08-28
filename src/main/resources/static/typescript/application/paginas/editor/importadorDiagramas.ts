/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *    https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

import CarregarCSSCommand, {
  CarregarCSSCommandBuilder,
} from "infrastructure/command/carregarCSSCommand";
import GeradorIDAba from "infrastructure/gerador/geradorIDAba";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";
import AbaJSON from "domain/json/abaJSON";
import DiagramasJSON from "domain/json/diagramasJSON";
import Aba from "domain/model/aba";
import IRepositorioAbas from "domain/model/repositorio/iRepositorioAbas";
import IRepositorioComponente from "domain/model/repositorio/iRepositorioComponente";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";

export default class ImportadorDiagramas {
  private _dados: DiagramasJSON | undefined;

  private readonly _abaPadrao: Aba;
  private readonly _diagrama: HTMLElement | null;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _fecharAba: (event: MouseEvent) => void;
  private readonly _geradorIDAba: GeradorIDAba;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioAbas: IRepositorioAbas;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private readonly _selecionadorAba: SelecionadorAba;
  private readonly _seletorAbas: HTMLElement | null;

  constructor(
    abaPadrao: Aba,
    diagrama: HTMLElement | null,
    fabricaComponente: ComponenteFactory,
    fecharAba: (event: MouseEvent) => void,
    geradorIDAba: GeradorIDAba,
    registradorEventosConexao: RegistradorEventosConexao,
    registradorEventosElemento: RegistradorEventosElemento,
    repositorioAbas: IRepositorioAbas,
    repositorioComponentes: IRepositorioComponente,
    selecionadorAba: SelecionadorAba,
    seletorAbas: HTMLElement | null,
  ) {
    this._abaPadrao = abaPadrao;
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._fecharAba = fecharAba;
    this._geradorIDAba = geradorIDAba;
    this._registradorEventosConexao = registradorEventosConexao;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioAbas = repositorioAbas;
    this._repositorioComponentes = repositorioComponentes;
    this._selecionadorAba = selecionadorAba;
    this._seletorAbas = seletorAbas;
  }

  public async carregarArquivo(event: InputEvent): Promise<void> {
    let fileInput: HTMLInputElement = event.target as HTMLInputElement;
    let arquivo: File | null = fileInput.files && fileInput.files[0];
    let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
    let csrfToken: string = csrfMetaTag?.content || "";

    if (arquivo === null) {
      return;
    }

    let response: Response | undefined = undefined;
    if (arquivo.name.endsWith(".xhtml")) {
      response = await fetch("/importar", {
        headers: {
          "Content-Type": "application/xhtml+xml",
          "X-XSRF-TOKEN": csrfToken,
        },
        method: "POST",
        body: JSON.stringify(await new Response(arquivo).text()),
      });
    }

    this._dados = response ? await response.json() : await new Response(arquivo).json();
    this.carregarTiposDiagramas();
    this.carregarArquivosCSS();
    await this.carregarAbas();
    await this.carregarComponentes();
  }

  carregarTiposDiagramas(): void {
    this._dados?.types.forEach((type: string): void => {
      let typeSelector: HTMLInputElement | null = document.querySelector(
        `input[value=${type.toUpperCase()}]`,
      );

      if (!typeSelector?.checked) {
        typeSelector?.click();
      }
    });
  }

  carregarArquivosCSS(): void {
    this._dados?.loadedCSSFiles.forEach((loadedCSSFile: string): void => {
      let command: CarregarCSSCommand = new CarregarCSSCommandBuilder()
        .definirNomeArquivo(loadedCSSFile.substring(0, loadedCSSFile.length - 4))
        .build();
      command.execute();
    });
  }

  async carregarAbas(): Promise<void> {
    const { default: criarAba } = await import("infrastructure/services/criarAba");

    if (!this._dados) {
      return;
    }

    this._repositorioAbas
      .listar()
      .slice(1)
      .map((aba: Aba): void => {
        this._repositorioAbas.remover(aba);
      });

    this._geradorIDAba.id = this._dados.tabs[this._dados.tabs.length - 1].id;

    let tabs: AbaJSON[] = this._dados.tabs.filter((tab: AbaJSON): boolean => tab.id !== 1);
    let numeroAbaPadrao: HTMLElement | null = this._abaPadrao.htmlElement.querySelector(
      `.${Aba.CLASSE_NUMERO_ABA}`,
    );

    if (numeroAbaPadrao) {
      numeroAbaPadrao.innerText = this._dados.tabs[0].nome;
    }

    for (const tab of tabs) {
      let novaAba: Aba = await criarAba(tab.id, this._fecharAba);

      this._seletorAbas?.append(novaAba.htmlElement);

      let htmlElementNumeroAba: HTMLElement | null = novaAba.htmlElement.querySelector(
        `.${Aba.CLASSE_NUMERO_ABA}`,
      );

      if (htmlElementNumeroAba) {
        htmlElementNumeroAba.innerText = tab.nome;
      }

      this._repositorioAbas.adicionar(novaAba);

      novaAba.htmlElement.addEventListener("click", (): void => {
        this._selecionadorAba.selecionarAba(novaAba);
      });
    }
  }

  async carregarComponentes(): Promise<void> {
    this._repositorioComponentes
      .listar()
      .map((componente: ComponenteDiagrama): void =>
        this._repositorioComponentes.remover(componente),
      );

    if (!this._dados) {
      return;
    }

    for (const component of this._dados.components) {
      let novoComponente: ComponenteDiagrama = await this._fabricaComponente.criarComponente(
        component.nomeComponente,
      );
      this._registradorEventosElemento.registrarEventos(novoComponente.htmlComponente);

      if (
        component.classes.filter((componentClass: string): void => {
          componentClass.includes("conexao");
        }).length > 0
      ) {
        this._registradorEventosConexao.registrarEventos(novoComponente.htmlComponente);
      }

      this._repositorioComponentes.adicionar(novoComponente);
      this._diagrama?.append(novoComponente.htmlComponente);

      novoComponente.htmlComponente.innerHTML = component.innerHTML;

      novoComponente.htmlComponente.setAttribute(Aba.ATRIBUTO_INDICE_ABA, `${component.idAba}`);
      novoComponente.htmlComponente.setAttribute(
        ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE,
        `${component.idComponente}`,
      );

      if (component.height !== -1) {
        novoComponente.htmlComponente.style.setProperty("height", `${component.height}px`);
      }

      if (component.width !== -1) {
        novoComponente.htmlComponente.style.setProperty("width", `${component.width}px`);
      }

      if (component.rotation !== "none") {
        novoComponente.htmlComponente.style.setProperty("rotate", `${component.rotation}`);
      }

      novoComponente.htmlComponente.style.setProperty("left", `${component.x}px`);
      novoComponente.htmlComponente.style.setProperty("top", `${component.y}px`);
    }

    this._selecionadorAba.removerSelecao();
    this._selecionadorAba.selecionarAba(this._abaPadrao);
  }
}
