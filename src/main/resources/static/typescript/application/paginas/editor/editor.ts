/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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
  limparPropriedades,
  mouseDownSelecionarElemento,
} from "application/paginas/editor/editorPropriedades";
import ImportadorDiagramas from "application/paginas/editor/importadorDiagramas";
import "application/paginas/editor/painelLateral";
import { CarregarCSSCommandBuilder } from "infrastructure/command/carregarCSSCommand";
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
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import DirecoesMovimento from "domain/enum/direcoesMovimento";
import LateraisComponente from "domain/enum/lateraisComponente";
import NomesComponente from "domain/enum/nomesComponente";
import TiposConexao from "domain/enum/tiposConexao";
import ChangeConnectionTypeEvent from "domain/event/changeConnectionTypeEvent";
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

new CarregarCSSCommandBuilder().definirNomeArquivo("aba_xhtml").build().execute();
new CarregarCSSCommandBuilder().definirNomeArquivo(NomesComponente.COMPONENTE).build().execute();

/***************************/
/* DESSELECIONAR COMPONENTE */
/***************************/

diagrama?.addEventListener("click", (event: MouseEvent): void => {
  let target: HTMLElement = event.target as HTMLElement;

  if (target.tagName === "MAIN") {
    selecionadorComponente.removerSelecao();
    limparPropriedades(abaPropriedades);
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

  selecionadorComponente.mostrarPontosExtensores();
  selecionadorComponente.atualizar();
}

function dragElement(event: MouseEvent): void {
  event.preventDefault();
  let x: number = event.pageX - offsetX;
  let y: number = event.pageY - offsetY;
  window.scrollTo(x, y);
  componenteAtual.style.left = `${x}px`;
  componenteAtual.style.top = `${y}px`;

  selecionadorComponente.atualizar();
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

/*******************/
/* CONFIRMAR SAÍDA */
/*******************/

document
  .querySelector("button:has(a[title=Home])")
  ?.addEventListener("click", async (): Promise<void> => {
    if (window.confirm(await traduzirChaveI18n("web.page.editor.confirm-exit"))) {
      window.location.href = "/";
    }
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
  let chaveI18NDiagrama: string | null = btn.getAttribute(
    ComponenteFactory.PROPRIEDADE_CHAVE_I18N_DIAGRAMA,
  );
  let nomeDiagrama: string | null = btn.getAttribute(Aba.ATRIBUTO_NOME_DIAGRAMA_ABA);
  let nomeElemento: string | null = btn.getAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE);

  let nomeAbaAtual: string | null | undefined =
    selecionadorAba.abaSelecionada?.htmlElement.getAttribute(Aba.ATRIBUTO_NOME_DIAGRAMA_ABA);

  if (utilizarAbasExclusivas) {
    if (nomeDiagrama && (nomeAbaAtual === null || nomeAbaAtual === undefined)) {
      selecionadorAba.abaSelecionada?.htmlElement.setAttribute(
        Aba.ATRIBUTO_NOME_DIAGRAMA_ABA,
        nomeDiagrama,
      );

      let nomeAba: HTMLElement | null | undefined =
        selecionadorAba.abaSelecionada?.htmlElement.querySelector(`.${Aba.CLASSE_NUMERO_ABA}`);

      if (chaveI18NDiagrama && nomeAba) {
        nomeAba.innerText = `${selecionadorAba.abaSelecionada?.id} - ${await traduzirChaveI18n(chaveI18NDiagrama)}`;
      }
    } else if (nomeDiagrama && nomeAbaAtual !== nomeDiagrama) {
      await criarNovaAba();
      let abas: Aba[] = repositorioAbas.listar();
      let indiceUltimaAba: number = abas.length - 1;
      let ultimaAba: Aba = abas[indiceUltimaAba];
      selecionadorAba.selecionarAba(ultimaAba);
      ultimaAba.htmlElement.setAttribute(Aba.ATRIBUTO_NOME_DIAGRAMA_ABA, nomeDiagrama);

      let nomeAba: HTMLElement | null = ultimaAba.htmlElement.querySelector(
        `.${Aba.CLASSE_NUMERO_ABA}`,
      );

      if (chaveI18NDiagrama && nomeAba) {
        nomeAba.innerText = `${ultimaAba.id} - ${await traduzirChaveI18n(chaveI18NDiagrama)}`;
      }
    }
  }

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
    .definirSelecionadorComponente(selecionadorComponente)
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
    ) === NomesComponente.TABELA_RELACIONAL &&
    conectarComponentesCommandBuilder.segundoComponente?.htmlComponente.getAttribute(
      ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
    ) === NomesComponente.TABELA_RELACIONAL
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

    let indiceAbaAtual: number | undefined = selecionadorAba.abaSelecionada?.id;
    let componentesVisiveis: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.componente[data-indice-aba=${indiceAbaAtual}]`,
    );

    for (const componenteAbaAtual of componentesVisiveis) {
      let nomeComponente: string | null = componenteAbaAtual.getAttribute(
        ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
      );

      if (
        nomeComponente === NomesComponente.EDITOR_DESCRICAO_RELACIONAL ||
        nomeComponente === NomesComponente.TABELA_DICIONARIO_DADOS
      ) {
        return;
      }
    }

    let command = new CriarComponenteCommandBuilder()
      .definirDiagrama(diagrama)
      .definirFabricaComponente(fabricaComponente)
      .definirGeradorIDComponente(geradorIDComponente)
      .definirNomeElemento(NomesComponente.ATRIBUTO_DER)
      .definirRegistradorEventosElemento(registradorEventosElemento)
      .definirRepositorioComponentes(repositorioComponentes)
      .definirSelecionadorAba(selecionadorAba)
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

/***********/
/* TOOLBAR */
/***********/

let spanButtonCopiar: HTMLSpanElement | null = document.querySelector("#copiar");
let spanButtonColar: HTMLSpanElement | null = document.querySelector("#colar");
let spanButtonCortar: HTMLSpanElement | null = document.querySelector("#cortar");
let spanButtonDesfazer: HTMLSpanElement | null = document.querySelector("#desfazer");
let spanButtonRefazer: HTMLSpanElement | null = document.querySelector("#refazer");
let spanButtonApagar: HTMLSpanElement | null = document.querySelector("#apagar");
let spanButtonDeletar: HTMLSpanElement | null = document.querySelector("#deletar");

spanButtonApagar?.addEventListener("click", async (): Promise<void> => {
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
});

spanButtonDeletar?.addEventListener("click", async (): Promise<void> => {
  let traducao: ResponseTraducaoJSON = await (
    await fetch("/traducao/web.page.editor.confirm.delete-all")
  ).json();
  if (window.confirm(traducao.mensagem)) {
    const { ApagarTodosComponentesCommandBuilder } =
      await import("infrastructure/command/apagarTodosComponentesCommand");

    let command = new ApagarTodosComponentesCommandBuilder()
      .definirDiagrama(diagrama)
      .definirRepositorioAba(repositorioAbas)
      .definirRepositorioComponente(repositorioComponentes)
      .build();
    command.execute();

    selecionadorAba.selecionarAba(abaPadrao);

    let numeroAbaPadrao: HTMLElement | null = abaPadrao.htmlElement.querySelector(".numero-aba");
    if (numeroAbaPadrao) {
      numeroAbaPadrao.innerHTML = `1 - ${await traduzirChaveI18n("web.page.editor.label.default-tab")}`;
    }

    geradorIDAba.id = 1;
    geradorIDComponente.id = 0;

    selecionadorComponente.removerSelecao();
    limparPropriedades(abaPropriedades);
  }
});

spanButtonDesfazer?.addEventListener("click", (): void => {
  commandHistory.undoLastCommand();
});

spanButtonRefazer?.addEventListener("click", (): void => {
  commandHistory.redoLastCommand();
});

spanButtonCopiar?.addEventListener("click", async (): Promise<void> => {
  const { CopiarComponenteCommandBuilder } =
    await import("infrastructure/command/copiarComponenteCommand");

  let command = new CopiarComponenteCommandBuilder()
    .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

spanButtonColar?.addEventListener("click", async (): Promise<void> => {
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

spanButtonCortar?.addEventListener("click", async (): Promise<void> => {
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
  selecionadorComponente.removerSelecao();
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

async function criarNovaAba(): Promise<void> {
  const { default: criarAba } = await import("infrastructure/services/criarAba");
  let novaAba: Aba = await criarAba(geradorIDAba.pegarProximoID(), fecharAba);

  seletorAbas?.append(novaAba.htmlElement);

  repositorioAbas.adicionar(novaAba);

  novaAba.htmlElement.addEventListener("click", (): void => {
    selecionadorComponente.removerSelecao();
    selecionadorAba.selecionarAba(novaAba);
  });
}

buttonNovaAba?.addEventListener("click", criarNovaAba);

/********************/
/* IMPORTAR ARQUIVO */
/********************/

let importadorDiagramas: ImportadorDiagramas = new ImportadorDiagramas(
  abaPadrao,
  diagrama,
  fabricaComponente,
  fecharAba,
  geradorIDAba,
  registradorEventosConexao,
  registradorEventosElemento,
  repositorioAbas,
  repositorioComponentes,
  selecionadorAba,
  seletorAbas,
);

let fileInput: HTMLInputElement = document.createElement("input");
fileInput.accept = ".json,.xhtml";
fileInput.name = "diagramas";
fileInput.type = "file";
fileInput.addEventListener("input", async (event: InputEvent): Promise<void> => {
  await importadorDiagramas.carregarArquivo(event);
});

let spanButtonImportar: HTMLSpanElement | null = document.querySelector("#abrir");
spanButtonImportar?.addEventListener("click", (): void => {
  fileInput.click();
});

/***********************/
/* BINDINGS DO USUÁRIO */
/***********************/

let teclaAnterior: string | null = null;

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  selecionadorComponente.componenteSelecionado?.atualizarPropriedades();

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
