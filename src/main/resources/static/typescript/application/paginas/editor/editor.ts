/*
 * Copyright (c) 2025. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *   https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

import {
  atualizarInputs,
  atualizarValorInput,
  editorEixoX,
  editorEixoY,
  inputs,
  limparPropriedades,
  mouseDownSelecionarElemento,
} from "application/paginas/editor/editorPropriedades";
import "application/paginas/editor/painelLateral";
import CarregarCSSCommand, {
  CarregarCSSCommandBuilder,
} from "infrastructure/command/carregarCSSCommand";
import CarregarDiagramaCommand, {
  CarregarDiagramaCommandBuilder,
} from "infrastructure/command/carregarDiagramaCommand";
import ConectarComponentesCommand, {
  ConectarComponentesCommandBuilder,
} from "infrastructure/command/conectarComponentesCommand";
import CommandHistoryFactory from "infrastructure/factory/commandHistoryFactory";
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import GeradorIDAbaFactory from "infrastructure/factory/geradorIDAbaFactory";
import GeradorIDComponenteFactory from "infrastructure/factory/geradorIDComponenteFactory";
import RegistradorEventosConexaoFactory from "infrastructure/factory/registradorEventosConexaoFactory";
import RegistradorEventosElementoFactory from "infrastructure/factory/registradorEventosElementoFactory";
import RepositorioAbasFactory from "infrastructure/factory/repositorioAbasFactory";
import RepositorioComponenteFactory from "infrastructure/factory/repositorioComponenteFactory";
import RepositorioTiposDiagramaFactory from "infrastructure/factory/repositorioTiposDiagramaFactory";
import SelecionadorAbaFactory from "infrastructure/factory/selecionadorAbaFactory";
import SelecionadorComponenteFactory from "infrastructure/factory/selecionadorComponenteFactory";
import GeradorIDAba from "infrastructure/gerador/geradorIDAba";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import CommandHistory from "infrastructure/history/commandHistory";
import moverComponente from "infrastructure/moverComponente";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import RepositorioAbas from "infrastructure/repositorio/repositorioAbas";
import RepositorioComponente from "infrastructure/repositorio/repositorioComponente";
import RepositorioTiposDiagrama from "infrastructure/repositorio/repositorioTiposDiagrama";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";
import SelecionadorComponente from "infrastructure/selecionador/selecionadorComponente";
import "infrastructure/variaveisConfiguracao";
import SeletorTipoConexao from "infrastructure/seletorTipoConexao";
import DirecoesMovimento from "domain/enum/direcoesMovimento";
import LateraisComponente from "domain/enum/lateraisComponente";
import NomesComponente from "domain/enum/nomesComponente";
import TiposConexao from "domain/enum/tiposConexao";
import ChangeConnectionTypeEvent from "domain/event/changeConnectionTypeEvent";
import AbaJSON from "domain/json/abaJSON";
import DiagramasJSON from "domain/json/diagramasJSON";
import AbstractComponenteConexao from "domain/model/componente/abstractComponenteConexao";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import ResponseTraducaoJSON from "domain/json/responseTraducaoJSON";
import Aba from "domain/model/aba";
import Ponto from "domain/model/ponto";
import SetaConectora from "domain/model/setaConectora";
import converterPixeisParaNumero from "domain/services/converterPixeisParaNumero";

/****************************/
/* VARIÁVEIS COMPARTILHADAS */
/****************************/

let abaPropriedades: HTMLDivElement | null = document.querySelector("section#propriedades");
let commandHistory: CommandHistory = CommandHistoryFactory.build();
let diagrama: HTMLElement | null = document.querySelector("main");
let fabricaComponente: ComponenteFactory = new ComponenteFactory();
let geradorIDAba: GeradorIDAba = GeradorIDAbaFactory.build();
let geradorIDComponente: GeradorIDComponente = GeradorIDComponenteFactory.build();
let registradorEventosConexao: RegistradorEventosConexao = RegistradorEventosConexaoFactory.build();
let registradorEventosElemento: RegistradorEventosElemento =
  RegistradorEventosElementoFactory.build();
let repositorioAbas: RepositorioAbas = RepositorioAbasFactory.build();
let repositorioComponentes: RepositorioComponente = RepositorioComponenteFactory.build();
let repositorioTiposDiagrama: RepositorioTiposDiagrama = RepositorioTiposDiagramaFactory.build();
let componentes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".componente");
let selecionadorAba: SelecionadorAba = SelecionadorAbaFactory.build();
let selecionadorComponente: SelecionadorComponente = SelecionadorComponenteFactory.build();
let seletorAbas: HTMLElement | null = document.querySelector("footer div");

componentes.forEach((componente: HTMLDivElement): void => {
  repositorioComponentes.adicionar(new ComponenteDiagrama(componente, []));
});

new CarregarCSSCommandBuilder().definirNomeArquivo(NomesComponente.COMPONENTE).build().execute();

/***************************/
/* DESSELECIONAR COMPONENTE */
/***************************/

diagrama?.addEventListener("click", (event: MouseEvent): void => {
  let target: HTMLElement = event.target as HTMLElement;

  if (target.tagName === "MAIN") {
    selecionadorComponente.removerSelecao();
    limparPropriedades(abaPropriedades);
    atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
  }
});

/*********************************/
/* MOVIMENTAÇÃO DE UM COMPONENTE */
/*********************************/

let componenteAtual: HTMLDivElement;
let offsetX: number;
let offsetY: number;

function mouseDownComecarMoverElemento(event: MouseEvent): void {
  let componente: HTMLDivElement = event.target as HTMLDivElement;

  if (!componente.classList.contains(ComponenteDiagrama.CLASSE_BASE_COMPONENTE)) {
    return;
  }

  let estiloComponente: CSSStyleDeclaration = getComputedStyle(componente);
  offsetX = event.clientX - converterPixeisParaNumero(estiloComponente.left);
  offsetY = event.clientY - converterPixeisParaNumero(estiloComponente.top);
  componente.classList.add("dragging");
  document.addEventListener("mousemove", dragElement);
  document.body.style.setProperty("user-select", "none");
  componenteAtual = componente;
  selecionadorComponente.esconderPontosExtensores();
}

function mouseUpPararMoverElemento(event: Event): void {
  let componente: HTMLElement = event.target as HTMLElement;
  componente.classList.remove("dragging");
  document.removeEventListener("mousemove", dragElement);
  document.body.style.removeProperty("user-select");

  if (selecionadorComponente.componenteSelecionado) {
    selecionadorComponente.mostrarPontosExtensores();
    selecionadorComponente.reposicionarPontosExtensores();
  }
}

function dragElement(event: MouseEvent): void {
  event.preventDefault();
  let x: number = event.pageX - offsetX;
  let y: number = event.pageY - offsetY;
  window.scrollTo(x, y);
  componenteAtual.style.left = `${x}px`;
  componenteAtual.style.top = `${y}px`;
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoY, "top");
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoX, "left");

  let componente: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(
    event.target as HTMLElement,
  );

  if (componente === null) return;
  selecionadorComponente.reposicionarSetasConectoras(componente);
  componente.atualizarOuvintes();
}

/***********************/
/* EVENTOS COMPONENTES */
/***********************/

registradorEventosConexao.adicionarCallback("mousedown", mouseDownSelecionarElemento);
registradorEventosConexao.adicionarCallback(
  ChangeConnectionTypeEvent.CHANGE_CONNECTION_TYPE_EVENT,
  trocarTipoConexao,
);

registradorEventosElemento.adicionarCallback("mousedown", mouseDownSelecionarElemento);
registradorEventosElemento.adicionarCallback("mousedown", mouseDownComecarMoverElemento);
registradorEventosElemento.adicionarCallback("mouseup", mouseUpPararMoverElemento);
registradorEventosElemento.adicionarCallback("mouseup", conectarElementos);

componentes.forEach((componente: HTMLDivElement): void => {
  registradorEventosElemento.registrarEventos(componente);
});

/**************************/
/* CARREGAMENTO DIAGRAMAS */
/**************************/

let sectionComponentes: HTMLElement | null = document.querySelector("#componentes");
let inputsCarregarDiagrama: NodeListOf<HTMLInputElement> =
  document.querySelectorAll("input.carregar-diagrama");
let tiposDiagrama: HTMLElement | null = document.querySelector("#tipos-diagrama");

async function callbackCriarComponente(event: Event): Promise<void> {
  let btn: HTMLButtonElement = event.target as HTMLButtonElement;
  let nomeElemento: string | null = btn.getAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE);

  const { CriarComponenteCommandBuilder } =
    await import("infrastructure/command/criarComponenteCommand");

  let command = new CriarComponenteCommandBuilder()
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirGeradorIDComponente(geradorIDComponente)
    .definirNomeElemento(nomeElemento)
    .definirRegistradorEventosElemento(registradorEventosElemento)
    .definirRepositorioComponentes(repositorioComponentes)
    .definirSelecionadorAba(selecionadorAba)
    .build();
  commandHistory.saveAndExecuteCommand(command);
}

let inputsPorTipo: { [tipoDiagrama: string]: HTMLInputElement } = {};

inputsCarregarDiagrama.forEach((input: HTMLInputElement): void => {
  inputsPorTipo[input.value] = input;

  const command: CarregarDiagramaCommand = new CarregarDiagramaCommandBuilder()
    .definirCallbackCriarComponente(callbackCriarComponente)
    .definirCallbackFecharAba(fecharAba)
    .definirGeradorIDAba(geradorIDAba)
    .definirNomeDiagrama(input.value.toLowerCase())
    .definirRepositorioAbas(repositorioAbas)
    .definirRepositorioTiposDiagrama(repositorioTiposDiagrama)
    .definirSectionComponentes(sectionComponentes)
    .definirSelecionadorAba(selecionadorAba)
    .definirSeletorAbas(seletorAbas)
    .build();

  input.addEventListener("click", (event: Event): void => {
    let target: HTMLInputElement = event.target as HTMLInputElement;

    if (target.checked) {
      command.execute();
    } else {
      command.undo();
    }
  });
});

tiposDiagrama?.innerText
  ?.substring(1, tiposDiagrama?.innerText.length - 1)
  .toUpperCase()
  .split(",")
  .map((tipo: string): string => tipo.trim())
  .forEach((tipo: string): void => {
    if (inputsPorTipo[tipo]) {
      inputsPorTipo[tipo].click();
    }
  });

/**********************/
/* CONECTAR ELEMENTOS */
/**********************/

new CarregarCSSCommandBuilder().definirNomeArquivo(TiposConexao.CONEXAO_ANGULADA).build().execute();
let fabricaConexao: ComponenteConexaoFactory = new ComponenteConexaoFactory();
let seletorTipoConexao: SeletorTipoConexao = new SeletorTipoConexao();
let setaPlaceholder: HTMLElement = document.querySelector("#seta-placeholder") as HTMLElement;
let conectarComponentesCommandBuilder: ConectarComponentesCommandBuilder =
  new ConectarComponentesCommandBuilder();
selecionadorComponente.esconderSetasConectoras();

async function trocarTipoConexao(event: Event): Promise<void> {
  let changeConnectionTypeEvent: ChangeConnectionTypeEvent = event as ChangeConnectionTypeEvent;
  let conexaoAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(
    event.target as HTMLElement,
  );

  if (conexaoAlvo === null) {
    return;
  }

  const { TrocarTipoConexaoCommandBuilder } =
    await import("infrastructure/command/trocarTipoConexaoCommand");

  let command = new TrocarTipoConexaoCommandBuilder()
    .definirConexaoAlvo(conexaoAlvo as AbstractComponenteConexao)
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirFabricaConexao(fabricaConexao)
    .definirRegistradorEventosConexao(registradorEventosConexao)
    .definirRepositorioComponentes(repositorioComponentes)
    .definirTipoConexao(changeConnectionTypeEvent.tipoConexao)
    .build();

  commandHistory.saveAndExecuteCommand(command);
}

function callbackInicialSetaConectora(event: MouseEvent): void {
  document.addEventListener("mousemove", callbackMoverSeta);
  document.body.style.setProperty("user-select", "none");
  document.body.style.setProperty("cursor", "crosshair");

  setaPlaceholder.style.left = `${event.clientX}px`;
  setaPlaceholder.style.top = `${event.clientY}px`;
  setaPlaceholder.style.removeProperty("display");

  conectarComponentesCommandBuilder = new ConectarComponentesCommandBuilder()
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirFabricaConexao(fabricaConexao)
    .definirGeradorID(geradorIDComponente)
    .definirRegistradorEventosConexao(registradorEventosConexao)
    .definirRegistradorEventosElemento(registradorEventosElemento)
    .definirRepositorioComponentes(repositorioComponentes)
    .definirSelecionadorAba(selecionadorAba);
  let targetEvent: HTMLElement = event.target as HTMLElement;
  let lateralComponente: LateraisComponente =
    LateraisComponente[
      targetEvent.getAttribute(
        SetaConectora.ATRIBUTO_LATERAL_COMPONENTE,
      ) as keyof typeof LateraisComponente
    ];

  let componenteSelecionado: ComponenteDiagrama | null =
    selecionadorComponente.componenteSelecionado || null;
  conectarComponentesCommandBuilder
    .definirPrimeiroComponente(componenteSelecionado)
    .definirLateralPrimeiroComponente(lateralComponente);
}

async function conectarElementos(event: MouseEvent): Promise<void> {
  event.stopPropagation();
  event.stopImmediatePropagation();

  let elementoAlvo: HTMLElement = event.target as HTMLElement;
  let elementoAlvoBoundingRectangle: DOMRect = elementoAlvo.getBoundingClientRect();
  let componenteAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(elementoAlvo);

  if (componenteAlvo === null) {
    return;
  }

  let topElemento: number = elementoAlvoBoundingRectangle.top;
  let leftElemento: number = elementoAlvoBoundingRectangle.left;

  let positionX: number = event.pageX - leftElemento;
  let positionY: number = event.pageY - topElemento;

  const { default: calcularLateralComponente } =
    await import("domain/services/calcularLateralComponente");
  let lateralSegundoComponente: LateraisComponente = calcularLateralComponente(
    elementoAlvo,
    new Ponto(positionX, positionY),
  );

  conectarComponentesCommandBuilder
    .definirSegundoComponente(componenteAlvo)
    .definirLateralSegundoComponente(lateralSegundoComponente)
    .definirTipoConexao(seletorTipoConexao.tipoConexaoAtual);

  if (!conectarComponentesCommandBuilder.validate()) {
    callbackFinalSetaConectora();
    return;
  }

  if (
    conectarComponentesCommandBuilder.primeiroComponente?.htmlComponente.getAttribute(
      ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
    ) === NomesComponente.ENTIDADE &&
    conectarComponentesCommandBuilder.segundoComponente?.htmlComponente.getAttribute(
      ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
    ) === NomesComponente.ENTIDADE
  ) {
    const { ConectarDuasEntidadesCommandBuilder } =
      await import("infrastructure/command/conectarDuasEntidadesCommand");
    let command = new ConectarDuasEntidadesCommandBuilder()
      .copyAttributes(conectarComponentesCommandBuilder)
      .build();
    commandHistory.saveAndExecuteCommand(command);
    callbackFinalSetaConectora();

    return;
  }

  if (
    conectarComponentesCommandBuilder.primeiroComponente?.htmlComponente.getAttribute(
      ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
    ) === NomesComponente.ENTIDADE_RELACIONAL &&
    conectarComponentesCommandBuilder.segundoComponente?.htmlComponente.getAttribute(
      ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
    ) === NomesComponente.ENTIDADE_RELACIONAL
  ) {
    const { ConectarDuasEntidadesRelacionaisCommandBuilder } =
      await import("infrastructure/command/conectarDuasEntidadesRelacionaisCommand");

    let command = new ConectarDuasEntidadesRelacionaisCommandBuilder()
      .copyAttributes(conectarComponentesCommandBuilder)
      .build();
    commandHistory.saveAndExecuteCommand(command);
    callbackFinalSetaConectora();
    return;
  }

  let command: ConectarComponentesCommand = conectarComponentesCommandBuilder.build();
  commandHistory.saveAndExecuteCommand(command);
  callbackFinalSetaConectora();
}

function callbackFinalSetaConectora(): void {
  conectarComponentesCommandBuilder = new ConectarComponentesCommandBuilder();

  document.removeEventListener("mousemove", callbackMoverSeta);
  document.body.style.removeProperty("user-select");
  document.body.style.removeProperty("cursor");

  setaPlaceholder.style.setProperty("display", "none");
}

function callbackMoverSeta(event: MouseEvent): void {
  let x: number = event.clientX;
  let y: number = event.clientY;

  window.scrollTo(x, y);

  setaPlaceholder.style.left = `${x}px`;
  setaPlaceholder.style.top = `${y}px`;
}

document.addEventListener("mouseup", callbackFinalSetaConectora);

selecionadorComponente.setasConectoras.forEach((setaConectora: SetaConectora): void => {
  setaConectora.callback = callbackInicialSetaConectora;
});

/*********************/
/* CONECTAR ATRIBUTO */
/*********************/

let divComponentes: HTMLDivElement | null = document.querySelector("#painel-esquerdo");
let placeholderAtributo: HTMLElement = document.createElement("div");
placeholderAtributo.innerText = "X";
placeholderAtributo.id = "atributo-placeholder";
placeholderAtributo.style.display = "none";
placeholderAtributo.style.position = "absolute";

function trocarCallbackBtnAtributo(): void {
  let btnAtributo: HTMLButtonElement | null = document.querySelector(
    `button[${ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE}='${NomesComponente.ATRIBUTO_DER}']`,
  );

  if (btnAtributo) {
    btnAtributo.removeEventListener("click", callbackCriarComponente);
    btnAtributo.addEventListener("mousedown", callbackIniciarConexaoAtributo);
    diagrama?.append(placeholderAtributo);
  } else {
    placeholderAtributo.remove();
  }
}

function callbackIniciarConexaoAtributo(): void {
  document.addEventListener("mousemove", callbackMoverConectorAtributo);
  diagrama?.addEventListener("click", callbackTerminarConexaoAtributo);
  placeholderAtributo.style.removeProperty("display");
}

function callbackMoverConectorAtributo(event: MouseEvent): void {
  let x: number = event.clientX;
  let y: number = event.clientY;

  window.scrollTo(x, y);

  placeholderAtributo.style.left = `${x}px`;
  placeholderAtributo.style.top = `${y}px`;
}

async function callbackTerminarConexaoAtributo(event: MouseEvent): Promise<void> {
  document.removeEventListener("mousemove", callbackMoverConectorAtributo);
  diagrama?.removeEventListener("click", callbackTerminarConexaoAtributo);
  placeholderAtributo.style.display = "none";

  let elementoAlvo: HTMLElement = event.target as HTMLElement;
  let nomeElemento: string | null = elementoAlvo.getAttribute(
    ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
  );

  if (!nomeElemento) {
    const { CriarComponenteCommandBuilder } =
      await import("infrastructure/command/criarComponenteCommand");

    let command = new CriarComponenteCommandBuilder()
      .definirDiagrama(diagrama)
      .definirFabricaComponente(fabricaComponente)
      .definirGeradorIDComponente(geradorIDComponente)
      .definirNomeElemento(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE)
      .definirRegistradorEventosElemento(registradorEventosElemento)
      .definirRepositorioComponentes(repositorioComponentes)
      .build();

    commandHistory.saveAndExecuteCommand(command);

    setTimeout((): void => {
      let componentes: ComponenteDiagrama[] = repositorioComponentes.listar();
      let componenteAtributo: ComponenteDiagrama | undefined = componentes.at(
        componentes.length - 1,
      );
      componenteAtributo?.htmlComponente.style.setProperty("left", placeholderAtributo.style.left);
      componenteAtributo?.htmlComponente.style.setProperty("top", placeholderAtributo.style.top);
    }, 20);

    return;
  }

  const { ConectarAtributoCommandBuilder } =
    await import("infrastructure/command/conectarAtributoCommand");

  if (!ConectarAtributoCommandBuilder.verificarElementoPermitido(nomeElemento)) {
    return;
  }

  let componenteAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(elementoAlvo);

  let elementoDOMRect: DOMRect = elementoAlvo.getBoundingClientRect();
  let positionX: number = event.pageX - elementoDOMRect.left;
  let positionY: number = event.pageY - elementoDOMRect.top;

  let command = new ConectarAtributoCommandBuilder()
    .definirComponenteAlvo(componenteAlvo)
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirFabricaConexao(fabricaConexao)
    .definirGeradorID(geradorIDComponente)
    .definirPontoAlvo(new Ponto(positionX, positionY))
    .definirRegistradorEventosConexao(registradorEventosConexao)
    .definirRegistradorEventosElemento(registradorEventosElemento)
    .definirRepositorioComponentes(repositorioComponentes)
    .definirSelecionadorAba(selecionadorAba)
    .definirTipoConexao(TiposConexao.CONEXAO_ANGULADA)
    .build();

  commandHistory.saveAndExecuteCommand(command);
}

const conectarAtributoObserver = new MutationObserver(trocarCallbackBtnAtributo);

if (divComponentes) {
  conectarAtributoObserver.observe(divComponentes, { childList: true, subtree: true });
}

/********************/
/* IMPORTAR ARQUIVO */
/********************/

function importar(): void {
  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";

  let fileInput: HTMLInputElement = document.createElement("input");
  fileInput.name = "diagramas";
  fileInput.type = "file";

  fileInput.click();
  fileInput.addEventListener("input", carregarArquivoDiagramas);

  async function carregarArquivoDiagramas(): Promise<void> {
    if (fileInput.files && fileInput.files[0].name.endsWith(".xhtml")) {
      await fetch("/importar", {
        headers: {
          "Content-Type": "application/xhtml+xml",
          "X-XSRF-TOKEN": csrfToken,
        },
        method: "POST",
        body: JSON.stringify(await new Response(fileInput.files[0]).text()),
      });

      return;
    } else if (fileInput.files && fileInput.files[0].name.endsWith(".json")) {
      let dados: DiagramasJSON = await new Response(fileInput.files[0]).json();

      /******************/
      /* CARREGAR TIPOS */
      /******************/
      for (const type of dados.types) {
        let typeSelector: HTMLInputElement | null = document.querySelector(
          `input[value=${type.toUpperCase()}]`,
        );

        if (!typeSelector?.checked) {
          typeSelector?.click();
        }
      }

      /*****************/
      /* CARREGAR CSS  */
      /*****************/
      for (const loadedCSSFile of dados.loadedCSSFiles) {
        let command: CarregarCSSCommand = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(loadedCSSFile.substring(0, loadedCSSFile.length - 4))
          .build();
        command.execute();
      }

      /*****************/
      /* CARREGAR ABAS */
      /*****************/
      const { default: criarAba } = await import("infrastructure/services/criarAba");

      repositorioAbas
        .listar()
        .slice(1)
        .map((aba: Aba): void => repositorioAbas.remover(aba));
      let tabs: AbaJSON[] = dados.tabs.filter((tab: AbaJSON): boolean => tab.id !== 1);

      geradorIDAba.id = dados.tabs[dados.tabs.length - 1].id;

      let numeroAbaPadrao: HTMLElement | null = abaPadrao.htmlElement.querySelector(
        `.${Aba.CLASSE_NUMERO_ABA}`,
      );

      if (numeroAbaPadrao) {
        numeroAbaPadrao.innerText = dados.tabs[0].nome;
      }

      for (const tab of tabs) {
        let novaAba: Aba = await criarAba(tab.id, fecharAba);

        seletorAbas?.append(novaAba.htmlElement);

        let htmlElementNumeroAba: HTMLElement | null = novaAba.htmlElement.querySelector(
          `.${Aba.CLASSE_NUMERO_ABA}`,
        );

        if (htmlElementNumeroAba) {
          htmlElementNumeroAba.innerText = tab.nome;
        }

        repositorioAbas.adicionar(novaAba);

        novaAba.htmlElement.addEventListener("click", (): void => {
          selecionadorAba.selecionarAba(novaAba);
        });
      }

      /************************/
      /* CARREGAR COMPONENTES */
      /************************/

      repositorioComponentes
        .listar()
        .map((componente: ComponenteDiagrama): void => repositorioComponentes.remover(componente));

      for (const component of dados.components) {
        let novoComponente: ComponenteDiagrama = await fabricaComponente.criarComponente(
          component.nomeComponente,
        );
        registradorEventosElemento.registrarEventos(novoComponente.htmlComponente);

        if (
          component.classes.filter((componentClass: string): void => {
            componentClass.includes("conexao");
          }).length > 0
        ) {
          registradorEventosConexao.registrarEventos(novoComponente.htmlComponente);
        }

        repositorioComponentes.adicionar(novoComponente);
        diagrama?.append(novoComponente.htmlComponente);

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
    }

    selecionadorAba.removerSelecao();
    selecionadorAba.selecionarAba(abaPadrao);
  }
}

let buttonImportar: HTMLButtonElement | null = document.querySelector("#btn-importar");
buttonImportar?.addEventListener("click", importar);

/***********/
/* TOOLBAR */
/***********/

let toolbarButton: HTMLButtonElement | null = document.querySelector("#barra-de-tarefas-button");
let toolbar: HTMLDetailsElement | null = document.querySelector("details:has(.barra-de-tarefas)");

toolbarButton?.addEventListener("click", (): void => {
  if (toolbar) {
    toolbar.open = !toolbar.open;

    let larguraBody: number = document.body.getBoundingClientRect().width;
    let larguraDivToolbar: number = larguraBody * 0.6;

    toolbar.querySelector("div")?.style.setProperty("width", `${larguraDivToolbar}px`);
  }
});

let buttonCopiar: HTMLDivElement | null = document.querySelector("button#copiar");
let buttonColar: HTMLDivElement | null = document.querySelector("button#colar");
let buttonCortar: HTMLDivElement | null = document.querySelector("button#cortar");
let buttonRefazer: HTMLDivElement | null = document.querySelector("button#refazer");
let buttonDesfazer: HTMLDivElement | null = document.querySelector("button#desfazer");
let buttonApagar: HTMLDivElement | null = document.querySelector("button#apagar");
let buttonDeletar: HTMLDivElement | null = document.querySelector("button#deletar");

buttonApagar?.addEventListener("click", async (): Promise<void> => {
  const { ApagarComponenteCommandBuilder } =
    await import("infrastructure/command/apagarComponenteCommand");

  let command = new ApagarComponenteCommandBuilder()
    .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
    .definirDiagrama(diagrama)
    .definirRepositorioComponente(repositorioComponentes)
    .build();
  commandHistory.saveAndExecuteCommand(command);

  selecionadorComponente.removerSelecao();
  limparPropriedades(abaPropriedades);
  atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
});

buttonDeletar?.addEventListener("click", async (): Promise<void> => {
  let traducao: ResponseTraducaoJSON = await (
    await fetch("/traducao/web.page.editor.confirm.delete-all")
  ).json();
  if (window.confirm(traducao.mensagem)) {
    const { ApagarTodosComponentesCommandBuilder } =
      await import("infrastructure/command/apagarTodosComponentesCommand");

    let command = new ApagarTodosComponentesCommandBuilder()
      .definirDiagrama(diagrama)
      .definirRepositorioComponente(repositorioComponentes)
      .build();
    commandHistory.saveAndExecuteCommand(command);

    selecionadorComponente.removerSelecao();
    limparPropriedades(abaPropriedades);
    atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
  }
});

buttonDesfazer?.addEventListener("click", (): void => {
  commandHistory.undoLastCommand();
});

buttonRefazer?.addEventListener("click", (): void => {
  commandHistory.redoLastCommand();
});

buttonCopiar?.addEventListener("click", async (): Promise<void> => {
  const { CopiarComponenteCommandBuilder } =
    await import("infrastructure/command/copiarComponenteCommand");

  let command = new CopiarComponenteCommandBuilder()
    .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

buttonColar?.addEventListener("click", async (): Promise<void> => {
  const { ColarComponenteCommandBuilder } =
    await import("infrastructure/command/colarComponenteCommand");

  let command = new ColarComponenteCommandBuilder()
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirGeradorID(geradorIDComponente)
    .definirRegistradorEventos(registradorEventosElemento)
    .definirRepositorioComponente(repositorioComponentes)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

buttonCortar?.addEventListener("click", async (): Promise<void> => {
  const { CortarComponenteCommandBuilder } =
    await import("infrastructure/command/cortarComponenteCommand");

  let command = new CortarComponenteCommandBuilder()
    .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
    .definirRepositorioComponente(repositorioComponentes)
    .definirSelecionadorComponente(selecionadorComponente)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

/******************/
/* SELETOR DE ABA */
/******************/

let buttonNovaAba: HTMLDivElement | null = document.querySelector("#nova-aba");
let htmlElementAbaPadrao: HTMLDivElement = seletorAbas?.querySelector("div") as HTMLDivElement;
let abaPadrao: Aba = new Aba(1, htmlElementAbaPadrao);

repositorioAbas.adicionar(abaPadrao);

abaPadrao.htmlElement.addEventListener("click", (): void => {
  selecionadorAba.selecionarAba(abaPadrao);
});

selecionadorAba.selecionarAba(abaPadrao);

function fecharAba(event: MouseEvent): void {
  event.stopImmediatePropagation();
  event.stopPropagation();
  let elementoAlvo: HTMLElement = event.target as HTMLElement;
  elementoAlvo.parentElement?.remove();

  let idAbaAlvo: number = Number(elementoAlvo.parentElement?.getAttribute(Aba.ATRIBUTO_INDICE_ABA));
  repositorioAbas.removerPorID(idAbaAlvo);

  let elementosAba: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    `div[${Aba.ATRIBUTO_INDICE_ABA}="${idAbaAlvo}"]`,
  );

  for (const elemento of elementosAba) {
    let componenteAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(elemento);

    elemento.remove();

    if (!componenteAlvo) {
      continue;
    }

    repositorioComponentes.remover(componenteAlvo);
  }

  let abaSelecionada: Aba | null = selecionadorAba.abaSelecionada;
  selecionadorAba.removerSelecao();

  if (abaSelecionada === null || abaSelecionada?.htmlElement !== elementoAlvo.parentElement) {
    return;
  }

  let abas: Aba[] = repositorioAbas.listar();
  let proximaAba: Aba = abas[abas.length - 1];
  selecionadorAba.selecionarAba(proximaAba);
}

buttonNovaAba?.addEventListener("click", async (): Promise<void> => {
  const { default: criarAba } = await import("infrastructure/services/criarAba");
  let novaAba: Aba = await criarAba(geradorIDAba.pegarProximoID(), fecharAba);

  seletorAbas?.append(novaAba.htmlElement);

  repositorioAbas.adicionar(novaAba);

  novaAba.htmlElement.addEventListener("click", (): void => {
    selecionadorAba.selecionarAba(novaAba);
  });
});

/***********************/
/* BINDINGS DO USUÁRIO */
/***********************/

let teclaAnterior: string | null = null;

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoY, "top");
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoX, "left");
  if (teclaAnterior === null) {
    teclaAnterior = event.key;
  }

  // Leader key bindings
  if (teclaAnterior === bindings.get("leaderKey") && event.key === bindings.get("copiarElemento")) {
    import("infrastructure/command/copiarComponenteCommand").then(
      ({ CopiarComponenteCommandBuilder }): void => {
        let command = new CopiarComponenteCommandBuilder()
          .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
          .build();

        commandHistory.saveAndExecuteCommand(command);
      },
    );

    return;
  }

  if (teclaAnterior === bindings.get("leaderKey") && event.key === bindings.get("cortarElemento")) {
    import("infrastructure/command/cortarComponenteCommand").then(
      ({ CortarComponenteCommandBuilder }): void => {
        let command = new CortarComponenteCommandBuilder()
          .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
          .definirRepositorioComponente(repositorioComponentes)
          .definirSelecionadorComponente(selecionadorComponente)
          .build();

        commandHistory.saveAndExecuteCommand(command);
      },
    );

    return;
  }

  if (teclaAnterior === bindings.get("leaderKey") && event.key === bindings.get("colarElemento")) {
    import("infrastructure/command/colarComponenteCommand").then(
      ({ ColarComponenteCommandBuilder }): void => {
        let command = new ColarComponenteCommandBuilder()
          .definirDiagrama(diagrama)
          .definirFabricaComponente(fabricaComponente)
          .definirGeradorID(geradorIDComponente)
          .definirRegistradorEventos(registradorEventosElemento)
          .definirRepositorioComponente(repositorioComponentes)
          .build();
        commandHistory.saveAndExecuteCommand(command);

        return;
      },
    );
  }

  if (
    teclaAnterior === bindings.get("leaderKey") &&
    event.key === bindings.get("reverterUltimaAcao")
  ) {
    commandHistory.undoLastCommand();
    return;
  }

  if (
    teclaAnterior === bindings.get("leaderKey") &&
    event.key === bindings.get("desfazerUltimaReversao")
  ) {
    commandHistory.redoLastCommand();
    return;
  }

  switch (event.key) {
    // Limpar seleção
    case bindings.get("removerSelecao"):
      selecionadorComponente.removerSelecao();
      limparPropriedades(abaPropriedades);
      atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
      break;

    // Apagar elemento
    case bindings.get("apagarElemento"):
      import("infrastructure/command/apagarComponenteCommand").then(
        ({ ApagarComponenteCommandBuilder }): void => {
          let command = new ApagarComponenteCommandBuilder()
            .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
            .definirDiagrama(diagrama)
            .definirRepositorioComponente(repositorioComponentes)
            .build();
          commandHistory.saveAndExecuteCommand(command);

          selecionadorComponente.removerSelecao();
          limparPropriedades(abaPropriedades);
          atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
        },
      );

      break;

    // Mover elemento
    case bindings.get("moverElementoParaCima"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.CIMA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      selecionadorComponente.reposicionarPontosExtensores();
      break;

    case bindings.get("moverElementoParaBaixo"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.BAIXO,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      selecionadorComponente.reposicionarPontosExtensores();
      break;

    case bindings.get("moverElementoParaDireita"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.DIREITA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      selecionadorComponente.reposicionarPontosExtensores();
      break;

    case bindings.get("moverElementoParaEsquerda"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.ESQUERDA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      selecionadorComponente.reposicionarPontosExtensores();
      break;
  }

  teclaAnterior = event.key;
});
