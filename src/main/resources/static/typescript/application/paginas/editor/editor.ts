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
import ColarComponenteCommand, {
  ColarComponenteCommandBuilder,
} from "infrastructure/command/colarComponenteCommand";
import CopiarComponenteCommand, {
  CopiarComponenteCommandBuilder,
} from "infrastructure/command/copiarComponenteCommand";
import CortarComponenteCommand, {
  CortarComponenteCommandBuilder,
} from "infrastructure/command/cortarComponenteCommand";
import CarregarDiagramaCommand, {
  CarregarDiagramaCommandBuilder,
} from "infrastructure/command/carregarDiagramaCommand";
import { CarregarCSSCommandBuilder } from "infrastructure/command/carregarCSSCommand";
import ApagarComponenteCommand, {
  ApagarComponenteCommandBuilder,
} from "infrastructure/command/apagarComponenteCommand";
import ApagarTodosComponentesCommand, {
  ApagarTodosComponentesCommandBuilder,
} from "infrastructure/command/apagarTodosComponentesCommand";
import ConectarAtributoCommand, {
  ConectarAtributoCommandBuilder,
} from "infrastructure/command/conectarAtributoCommand";
import ConectarComponentesCommand, {
  ConectarComponentesCommandBuilder,
} from "infrastructure/command/conectarComponentesCommand";
import ConectarDuasEntidadesCommand, {
  ConectarDuasEntidadesCommandBuilder,
} from "infrastructure/command/conectarDuasEntidadesCommand";
import CriarComponenteCommand, {
  CriarComponenteCommandBuilder,
} from "infrastructure/command/criarComponenteCommand";
import TrocarTipoConexaoCommand, {
  TrocarTipoConexaoCommandBuilder,
} from "infrastructure/command/trocarTipoConexaoCommand";
import ConectarDuasEntidadesRelacionaisCommand, {
  ConectarDuasEntidadesRelacionaisCommandBuilder,
} from "infrastructure/command/conectarDuasEntidadesRelacionaisCommand";
import ChangeConnectionTypeEvent from "model/event/changeConnectionTypeEvent";
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
import criarAba from "infrastructure/services/criarAba";
import "infrastructure/variaveisConfiguracao";
import SeletorTipoConexao from "infrastructure/seletorTipoConexao";
import AbstractComponenteConexao from "model/componente/abstractComponenteConexao";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import NomesComponente from "model/componente/nomesComponente";
import TiposConexao from "model/conexao/tiposConexao";
import converterPixeisParaNumero from "model/services/converterPixeisParaNumero";
import calcularLateralComponente from "model/services/calcularLateralComponente";
import Aba from "model/aba";
import DirecoesMovimento from "model/direcoesMovimento";
import ResponseTraducaoJSON from "model/response/responseTraducaoJSON";
import SetaConectora from "model/setaConectora";
import Ponto from "model/ponto";

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
  // TODO: Calibrar o scroll automático
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

function callbackCriarComponente(event: Event): void {
  let btn: HTMLButtonElement = event.target as HTMLButtonElement;
  let nomeElemento: string | null = btn.getAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE);

  let command: CriarComponenteCommand = new CriarComponenteCommandBuilder()
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

function trocarTipoConexao(event: Event): void {
  let changeConnectionTypeEvent: ChangeConnectionTypeEvent = event as ChangeConnectionTypeEvent;
  let conexaoAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(
    event.target as HTMLElement,
  );

  if (conexaoAlvo === null) {
    return;
  }

  let command: TrocarTipoConexaoCommand = new TrocarTipoConexaoCommandBuilder()
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

function conectarElementos(event: MouseEvent): void {
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
    let command: ConectarDuasEntidadesCommand = new ConectarDuasEntidadesCommandBuilder()
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
    let command: ConectarDuasEntidadesRelacionaisCommand =
      new ConectarDuasEntidadesRelacionaisCommandBuilder()
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

function callbackTerminarConexaoAtributo(event: MouseEvent): void {
  document.removeEventListener("mousemove", callbackMoverConectorAtributo);
  diagrama?.removeEventListener("click", callbackTerminarConexaoAtributo);
  placeholderAtributo.style.display = "none";

  let elementoAlvo: HTMLElement = event.target as HTMLElement;
  let nomeElemento: string | null = elementoAlvo.getAttribute(
    ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
  );

  if (!nomeElemento) {
    let command: CriarComponenteCommand = new CriarComponenteCommandBuilder()
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

  if (!ConectarAtributoCommandBuilder.verificarElementoPermitido(nomeElemento)) {
    return;
  }

  let componenteAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(elementoAlvo);

  let elementoDOMRect: DOMRect = elementoAlvo.getBoundingClientRect();
  let positionX: number = event.pageX - elementoDOMRect.left;
  let positionY: number = event.pageY - elementoDOMRect.top;

  let command: ConectarAtributoCommand = new ConectarAtributoCommandBuilder()
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

buttonApagar?.addEventListener("click", (): void => {
  let command: ApagarComponenteCommand = new ApagarComponenteCommandBuilder()
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
    let command: ApagarTodosComponentesCommand = new ApagarTodosComponentesCommandBuilder()
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

buttonCopiar?.addEventListener("click", (): void => {
  let command: CopiarComponenteCommand = new CopiarComponenteCommandBuilder()
    .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

buttonColar?.addEventListener("click", (): void => {
  let command: ColarComponenteCommand = new ColarComponenteCommandBuilder()
    .definirDiagrama(diagrama)
    .definirFabricaComponente(fabricaComponente)
    .definirGeradorID(geradorIDComponente)
    .definirRegistradorEventos(registradorEventosElemento)
    .definirRepositorioComponente(repositorioComponentes)
    .build();
  commandHistory.saveAndExecuteCommand(command);
});

buttonCortar?.addEventListener("click", (): void => {
  let command: CortarComponenteCommand = new CortarComponenteCommandBuilder()
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
    let command: CopiarComponenteCommand = new CopiarComponenteCommandBuilder()
      .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
      .build();

    commandHistory.saveAndExecuteCommand(command);
    return;
  }

  if (teclaAnterior === bindings.get("leaderKey") && event.key === bindings.get("cortarElemento")) {
    let command: CortarComponenteCommand = new CortarComponenteCommandBuilder()
      .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
      .definirRepositorioComponente(repositorioComponentes)
      .definirSelecionadorComponente(selecionadorComponente)
      .build();

    commandHistory.saveAndExecuteCommand(command);
    return;
  }

  if (teclaAnterior === bindings.get("leaderKey") && event.key === bindings.get("colarElemento")) {
    let command: ColarComponenteCommand = new ColarComponenteCommandBuilder()
      .definirDiagrama(diagrama)
      .definirFabricaComponente(fabricaComponente)
      .definirGeradorID(geradorIDComponente)
      .definirRegistradorEventos(registradorEventosElemento)
      .definirRepositorioComponente(repositorioComponentes)
      .build();
    commandHistory.saveAndExecuteCommand(command);

    return;
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
      let command: ApagarComponenteCommand = new ApagarComponenteCommandBuilder()
        .definirComponenteAlvo(selecionadorComponente.componenteSelecionado)
        .definirDiagrama(diagrama)
        .definirRepositorioComponente(repositorioComponentes)
        .build();
      commandHistory.saveAndExecuteCommand(command);

      selecionadorComponente.removerSelecao();
      limparPropriedades(abaPropriedades);
      atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);

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
