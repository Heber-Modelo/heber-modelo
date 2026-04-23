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
import { DirecoesMovimento, moverComponente } from "application/paginas/editor/manipularComponente";
import "application/paginas/editor/painelLateral";
import SelecionadorComponente from "application/paginas/editor/selecionadorComponente";
import RepositorioComponente from "infrastructure/repositorio/repositorioComponente";
import RepositorioComponenteFactory from "infrastructure/factory/repositorioComponenteFactory";
import SelecionadorComponenteFactory from "infrastructure/factory/selecionadorComponenteFactory";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import ColarComponenteCommand, {
  ColarComponenteDiagramaBuilder,
} from "infrastructure/command/colarComponenteCommand";
import CopiarComponenteCommand, {
  CopiarComponenteCommandBuilder,
} from "infrastructure/command/copiarComponenteCommand";
import CortarComponenteCommand, {
  CortarComponenteCommandBuilder,
} from "infrastructure/command/cortarComponenteCommand";
import CarregarDiagramaCommand, {
  ATRIBUTO_NOME_ELEMENTO,
  CarregarDiagramaCommandBuilder,
} from "infrastructure/command/carregarDiagramaCommand";
import CarregarCSSCommand, {
  CarregarCSSCommandBuilder,
} from "infrastructure/command/carregarCSSCommand";
import ApagarComponenteCommand, {
  ApagarComponenteCommandBuilder,
} from "infrastructure/command/apagarComponenteCommand";
import ConectarComponentesCommand, {
  ConectarComponentesCommandBuilder,
} from "infrastructure/command/conectarComponentesCommand";
import CommandHistoryFactory from "infrastructure/factory/commandHistoryFactory";
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import GeradorIDComponenteFactory from "infrastructure/factory/geradorIDComponenteFactory";
import CommandHistory from "infrastructure/history/commandHistory";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import "infrastructure/variaveisConfiguracao";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import TiposConexao from "model/conexao/tiposConexao";
import SeletorTipoConexao from "infrastructure/conexao/seletorTipoConexao";
import SetaConectora from "infrastructure/conexao/setaConectora";
import LateraisComponente from "model/componente/lateraisComponente";

/****************************/
/* VARIÁVEIS COMPARTILHADAS */
/****************************/

let abaPropriedades: HTMLDivElement | null = document.querySelector("section#propriedades");
let commandHistory: CommandHistory = CommandHistoryFactory.build();
let diagrama: HTMLElement | null = document.querySelector("main");
let fabricaComponente: ComponenteFactory = new ComponenteFactory();
let geradorIDComponente: GeradorIDComponente = GeradorIDComponenteFactory.build();
let repositorioComponentes: RepositorioComponente = RepositorioComponenteFactory.build();
let componentes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".componente");
let selecionadorComponente: SelecionadorComponente = SelecionadorComponenteFactory.build();

componentes.forEach((componente: HTMLDivElement): void => {
  repositorioComponentes.adicionar(new ComponenteDiagrama(componente, []));
});

/*********************************/
/* MOVIMENTAÇÃO DE UM COMPONENTE */
/*********************************/

let componenteAtual: HTMLDivElement;
let offsetX: number;
let offsetY: number;

function mouseDownComecarMoverElemento(event: MouseEvent): void {
  let componente: HTMLDivElement = event.target as HTMLDivElement;

  if (!componente.classList.contains("componente")) {
    return;
  }

  offsetX = event.clientX - componente.getBoundingClientRect().left;
  offsetY = event.clientY - componente.getBoundingClientRect().top;
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
  selecionadorComponente.reposicionarPontosExtensores();
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
  selecionadorComponente.moverSetas(componente);
  componente.atualizarOuvintes();
}

/***********************/
/* EVENTOS COMPONENTES */
/***********************/

function registrarEventosComponente(componente: HTMLDivElement): void {
  componente.addEventListener("mousedown", mouseDownSelecionarElemento);
  componente.addEventListener("mousedown", mouseDownComecarMoverElemento);
  componente.addEventListener("mouseup", mouseUpPararMoverElemento);
  componente.addEventListener("mouseup", conectarElementos);
}

componentes.forEach((componente: HTMLDivElement): void => {
  registrarEventosComponente(componente);
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
  let nomeElemento: string | null = btn.getAttribute(ATRIBUTO_NOME_ELEMENTO);

  if (nomeElemento === null) {
    return;
  }

  fabricaComponente.criarComponente(nomeElemento).then((componente: ComponenteDiagrama): void => {
    let command: CarregarCSSCommand = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(nomeElemento)
      .build();
    command.execute();
    registrarEventosComponente(componente.htmlComponente);
    componente.htmlComponente.setAttribute(
      ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
      String(geradorIDComponente.pegarProximoID()),
    );
    repositorioComponentes.adicionar(componente);
    diagrama?.appendChild(componente.htmlComponente);
  });
}

let inputsPorTipo: { [tipoDiagrama: string]: HTMLInputElement } = {};

inputsCarregarDiagrama.forEach((input: HTMLInputElement): void => {
  inputsPorTipo[input.value] = input;

  const command: CarregarDiagramaCommand = new CarregarDiagramaCommandBuilder()
    .definirSectionComponentes(sectionComponentes as HTMLElement)
    .definirCallCriarComponente(callbackCriarComponente)
    .definirNomeDiagrama(input.value.toLowerCase())
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
    .definirRegistradorEventosElemento(registrarEventosComponente)
    .definirRepositorioComponentes(repositorioComponentes);
  let targetEvent: HTMLElement = event.target as HTMLElement;
  let lateralComponente: LateraisComponente =
    LateraisComponente[
      targetEvent.getAttribute(
        SetaConectora.ATRIBUTO_LATERAL_COMPONENTE,
      ) as keyof typeof LateraisComponente
    ];

  let componenteSelecionado: ComponenteDiagrama | undefined =
    selecionadorComponente.componenteSelecionado || undefined;
  conectarComponentesCommandBuilder
    .definirPrimeiroComponente(componenteSelecionado)
    .definirLateralPrimeiroComponente(lateralComponente);
}

function conectarElementos(event: MouseEvent): void {
  event.stopPropagation();
  event.stopImmediatePropagation();

  const HEIGHT_MINIMAL_THRESHOLD: number = 0.4;
  const HEIGHT_MAXIMAL_THRESHOLD: number = 0.6;
  const WIDTH_MINIMAL_THRESHOLD: number = 0.2;
  const WIDTH_MAXIMAL_THRESHOLD: number = 0.8;

  let elementoAlvo: HTMLElement = event.target as HTMLElement;
  let elementoAlvoBoundingRectangle: DOMRect = elementoAlvo.getBoundingClientRect();
  let componenteAlvo: ComponenteDiagrama | null = repositorioComponentes.pegarPorHTML(elementoAlvo);

  if (componenteAlvo === null) {
    return;
  }

  let alturaElemento: number = elementoAlvoBoundingRectangle.height;
  let larguraElemento: number = elementoAlvoBoundingRectangle.width;
  let topElemento: number = elementoAlvoBoundingRectangle.top;
  let leftElemento: number = elementoAlvoBoundingRectangle.left;

  let positionX: number = event.pageX - leftElemento;
  let positionY: number = event.pageY - topElemento;

  let esquerda: boolean = false;
  let direita: boolean = false;
  let centroX: boolean = false;

  if (
    positionX > larguraElemento * WIDTH_MINIMAL_THRESHOLD &&
    positionX < larguraElemento * WIDTH_MAXIMAL_THRESHOLD
  ) {
    centroX = true;
  } else if (positionX <= larguraElemento * WIDTH_MINIMAL_THRESHOLD) {
    esquerda = true;
  } else {
    direita = true;
  }

  let cima: boolean = false;
  let baixo: boolean = false;
  let centroY: boolean = false;

  if (
    positionY > alturaElemento * HEIGHT_MINIMAL_THRESHOLD &&
    positionY < alturaElemento * HEIGHT_MAXIMAL_THRESHOLD
  ) {
    centroY = true;
  } else if (positionY <= alturaElemento * HEIGHT_MINIMAL_THRESHOLD) {
    cima = true;
  } else {
    baixo = true;
  }

  let lateralSegundoComponente: LateraisComponente;

  if ((centroY || baixo || cima) && esquerda) {
    lateralSegundoComponente = LateraisComponente.OESTE;
  } else if ((centroY || baixo || cima) && direita) {
    lateralSegundoComponente = LateraisComponente.LESTE;
  } else if ((centroX && centroY) || cima) {
    lateralSegundoComponente = LateraisComponente.NORTE;
  } else {
    lateralSegundoComponente = LateraisComponente.SUL;
  }

  conectarComponentesCommandBuilder
    .definirSegundoComponente(componenteAlvo)
    .definirLateralSegundoComponente(lateralSegundoComponente)
    .definirTipoConexao(seletorTipoConexao.tipoConexaoAtual);

  if (conectarComponentesCommandBuilder.validate()) {
    let command: ConectarComponentesCommand = conectarComponentesCommandBuilder.build();
    commandHistory.saveAndExecuteCommand(command);
  }

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
    let command: ColarComponenteCommand = new ColarComponenteDiagramaBuilder()
      .definirFabricaComponente(fabricaComponente)
      .definirGeradorID(geradorIDComponente)
      .definirRegistradorEventos(registrarEventosComponente)
      .definirRepositorioComponente(repositorioComponentes)
      .definirDiagrama(diagrama)
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
      let componenteAlvo: ComponenteDiagrama | null = selecionadorComponente.componenteSelecionado;

      let command: ApagarComponenteCommand = new ApagarComponenteCommandBuilder()
        .definirComponenteAlvo(componenteAlvo)
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
