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

import { converterPixeisParaNumero } from "../../../infrastructure/conversor/conversor.js";
import {
  atualizarInputs,
  atualizarValorInput,
  limparPropriedades,
  mouseDownSelecionarElemento,
  editorEixoX,
  editorEixoY,
  inputs,
} from "./editorPropriedades.js";
import { carregarCSS } from "./carregarCSS.js";
import {
  ComponenteDiagrama,
  LateralComponente,
} from "../../../model/componente/componenteDiagrama.js";
import { RepositorioComponente } from "../../../infrastructure/repositorio/repositorioComponente.js";
import { repositorioComponenteFactory } from "../../../infrastructure/factory/repositorioComponenteFactory.js";
import { SelecionadorComponente } from "./selecionadorComponente.js";
import { selecionadorComponenteFactory } from "../../../infrastructure/factory/selecionadorComponenteFactory.js";
import { GeradorIDComponente } from "../../../infrastructure/gerador/geradorIDComponente.js";
import { ComponenteFactory } from "../../../infrastructure/factory/componenteFactory.js";
import { Ponto } from "../../../model/ponto.js";
import { DirecoesMovimento, moverComponente } from "./manipularComponente.js";
import { CarregadorDiagrama } from "../../carregador/carregadorDiagrama.js";
import { FabricaComponenteConexao } from "../../../model/conexao/fabricaComponenteConexao.js";
import { TipoConexao } from "../../../model/conexao/tipoConexao.js";
import "./painelLateral.js";
import CommandHistory from "../../history/commandHistory.js";
import ColarComponenteCommand, {
  ColarComponenteDiagramaBuilder,
} from "../../../infrastructure/command/colarComponenteCommand.js";
import CopiarComponenteCommand, {
  CopiarComponenteCommandBuilder,
} from "../../../infrastructure/command/copiarComponenteCommand.js";
import CortarComponenteCommand, {
  CortarComponenteCommandBuilder,
} from "../../../infrastructure/command/cortarComponenteCommand.js";

/****************************/
/* VARIÁVEIS COMPARTILHADAS */
/****************************/

let abaPropriedades: HTMLDivElement | null = document.querySelector("section#propriedades");
let commandHistory: CommandHistory = new CommandHistory();
let diagrama: HTMLElement | null = document.querySelector("main");
let fabricaComponente: ComponenteFactory = new ComponenteFactory();
let geradorIDComponente: GeradorIDComponente = GeradorIDComponente.pegarInstance();
let repositorioComponentes: RepositorioComponente = repositorioComponenteFactory.build();
let componentes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".componente");
let selecionadorComponente: SelecionadorComponente = selecionadorComponenteFactory.build();

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
  componenteAtual = componente;
}

function mouseUpPararMoverElemento(event: Event): void {
  let componente: HTMLElement = event.target as HTMLElement;
  componente.classList.remove("dragging");
  document.removeEventListener("mousemove", dragElement);
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
  componente.addEventListener("click", conectarElementos);
  componente.addEventListener("mousedown", mouseDownSelecionarElemento);
  componente.addEventListener("mousedown", mouseDownComecarMoverElemento);
  componente.addEventListener("mouseup", mouseUpPararMoverElemento);
}

componentes.forEach((componente: HTMLDivElement): void => {
  registrarEventosComponente(componente);
});

/********************/
/* CONEXÕES E SETAS */
/********************/

const setas: NodeListOf<HTMLElement> = document.querySelectorAll(".seta");
let fabricaConexao: FabricaComponenteConexao = new FabricaComponenteConexao();
let primeiroComponente: ComponenteDiagrama | null = null;
let lateralPrimeiroComponente: LateralComponente | null;
let ponto1: Ponto | null = null;

carregarCSS(TipoConexao.CONEXAO_ANGULADA);

setas.forEach((seta: HTMLElement): void =>
  seta.addEventListener("click", (): void => {
    if (selecionadorComponente.componenteSelecionado === null) return;

    primeiroComponente = selecionadorComponente.componenteSelecionado;
    let ponto: number[];

    if (seta.classList.contains("seta-direita")) {
      ponto = primeiroComponente.calcularPontoLateralComponente(LateralComponente.LESTE);
      lateralPrimeiroComponente = LateralComponente.LESTE;
    } else if (seta.classList.contains("seta-esquerda")) {
      ponto = primeiroComponente.calcularPontoLateralComponente(LateralComponente.OESTE);
      lateralPrimeiroComponente = LateralComponente.OESTE;
    } else if (seta.classList.contains("seta-superior")) {
      ponto = primeiroComponente.calcularPontoLateralComponente(LateralComponente.NORTE);
      lateralPrimeiroComponente = LateralComponente.NORTE;
    } else {
      ponto = primeiroComponente.calcularPontoLateralComponente(LateralComponente.SUL);
      lateralPrimeiroComponente = LateralComponente.SUL;
    }

    ponto1 = new Ponto(ponto[0], ponto[1]);
  }),
);

function limparCoordenadaInicial(): void {
  lateralPrimeiroComponente = null;
  ponto1 = null;
}

function conectarElementos(event: MouseEvent): void {
  diagrama?.removeEventListener("click", limparCoordenadaInicial);
  event.stopPropagation();
  event.stopImmediatePropagation();
  let elementoAlvo: HTMLElement = event.target as HTMLElement;

  let segundoComponente: ComponenteDiagrama | null =
    repositorioComponentes.pegarPorHTML(elementoAlvo);
  if (
    ponto1 === null ||
    ponto1 === undefined ||
    lateralPrimeiroComponente === undefined ||
    lateralPrimeiroComponente === null ||
    primeiroComponente === null ||
    segundoComponente === null
  )
    return;

  diagrama?.addEventListener("click", limparCoordenadaInicial);
  let estiloElementoAlvo: CSSStyleDeclaration = getComputedStyle(elementoAlvo);
  let alturaElementoAlvo: number = converterPixeisParaNumero(estiloElementoAlvo.height);
  let larguraElementoAlvo: number = converterPixeisParaNumero(estiloElementoAlvo.width);
  let leftElementoAlvo: number = converterPixeisParaNumero(estiloElementoAlvo.left);
  let topElemento: number = converterPixeisParaNumero(estiloElementoAlvo.top);
  let posX: number = event.pageX - leftElementoAlvo;
  let posY: number = event.pageY - topElemento;

  let centroX: boolean = false;
  let centroY: boolean = false;
  let direita: boolean = false;
  let esquerda: boolean = false;
  let cima: boolean = false;
  let baixo: boolean = false;
  let lateralSegundoComponente: LateralComponente;
  let x2: number;
  let y2: number;

  if (posX > larguraElementoAlvo * 0.2 && posX < larguraElementoAlvo * 0.8) {
    x2 = larguraElementoAlvo / 2 + leftElementoAlvo;
    centroX = true;
  } else if (posX <= larguraElementoAlvo * 0.2) {
    x2 = leftElementoAlvo;
    esquerda = true;
  } else {
    x2 = larguraElementoAlvo + leftElementoAlvo;
    direita = true;
  }

  if (posY > alturaElementoAlvo * 0.4 && posY < alturaElementoAlvo * 0.6) {
    y2 = alturaElementoAlvo / 2 + topElemento;
    centroY = true;
  } else if (posY <= alturaElementoAlvo * 0.4) {
    y2 = topElemento;
    baixo = true;
  } else {
    y2 = alturaElementoAlvo + topElemento;
    cima = true;
  }

  if ((centroY || baixo || cima) && esquerda) {
    lateralSegundoComponente = LateralComponente.OESTE;
  } else if ((centroY || baixo || cima) && direita) {
    lateralSegundoComponente = LateralComponente.LESTE;
  } else if ((centroX && centroX) || cima) {
    lateralSegundoComponente = LateralComponente.NORTE;
  } else {
    lateralSegundoComponente = LateralComponente.SUL;
  }

  let ponto2: Ponto = new Ponto(x2, y2);
  let seletorTipoConexao: HTMLDivElement = document.createElement("div");
  diagrama?.append(seletorTipoConexao);
  seletorTipoConexao.classList.add("seletor-tipo-conexao");

  for (let tipo in TipoConexao) {
    let btnTipoConexao: HTMLButtonElement = document.createElement("button");
    let tipoConexao: TipoConexao = TipoConexao[tipo as keyof typeof TipoConexao];

    btnTipoConexao.innerText = tipoConexao.split("_").join(" ");

    btnTipoConexao.addEventListener("click", (event: MouseEvent): void => {
      event.stopPropagation();
      fabricaComponente.criarComponente(tipo).then((componente: ComponenteDiagrama): void => {
        carregarCSS(tipoConexao);
        registrarEventosComponente(componente.htmlComponente);

        let componenteConexao: ComponenteDiagrama = fabricaConexao.criarConexao(
          tipoConexao,
          componente.htmlComponente,
          componente.propriedades,
          ponto1 as Ponto,
          ponto2,
          lateralPrimeiroComponente as LateralComponente,
          lateralSegundoComponente,
          primeiroComponente as ComponenteDiagrama,
          segundoComponente,
        );

        repositorioComponentes.adicionar(componenteConexao);
        diagrama?.append(componenteConexao.htmlComponente);
        limparCoordenadaInicial();
      });
      seletorTipoConexao.remove();
    });
    seletorTipoConexao.append(btnTipoConexao);
  }

  seletorTipoConexao.focus();
}

diagrama?.addEventListener("click", limparCoordenadaInicial);

/*******************************/
/* AJUSTAR TAMANHO COM O MOUSE */
/*******************************/

function iniciarReajusteTamanho(): void {
  window.addEventListener("mousemove", ajustarTamanhoComponente);
  window.addEventListener("mouseup", pararReajusteTamanho);
}

function pararReajusteTamanho(): void {
  window.removeEventListener("mousemove", ajustarTamanhoComponente);
  window.removeEventListener("mouseup", pararReajusteTamanho);
}

function ajustarTamanhoComponente(event: MouseEvent): void {
  let elemento: HTMLElement | undefined =
    selecionadorComponente.componenteSelecionado?.htmlComponente;

  if (elemento === undefined) {
    return;
  }

  elemento.style.height = Math.abs(event.clientY - elemento.offsetTop) + "px";
  elemento.style.width = Math.abs(event.clientX - elemento.offsetLeft) + "px";
}

setas.forEach((seta: HTMLElement): void => {
  seta.addEventListener("mousedown", iniciarReajusteTamanho);
});

/**************************/
/* CARREGAMENTO DIAGRAMAS */
/**************************/

let carregadorDiagrama: CarregadorDiagrama = new CarregadorDiagrama();
let sectionComponentes: HTMLElement | null = document.querySelector("#componentes");
let inputsCarregarDiagrama: NodeListOf<HTMLInputElement> =
  document.querySelectorAll("input.carregar-diagrama");
let tiposDiagrama: HTMLElement | null = document.querySelector("#tipos-diagrama");

function callbackCriarComponente(event: Event): void {
  let btn: HTMLButtonElement = event.target as HTMLButtonElement;
  let nomeElemento: string | null = btn.getAttribute("data-nome-elemento");

  if (nomeElemento === null) {
    return;
  }

  fabricaComponente.criarComponente(nomeElemento).then((componente: ComponenteDiagrama): void => {
    carregarCSS(nomeElemento);
    registrarEventosComponente(componente.htmlComponente);
    componente.htmlComponente.setAttribute("data-id", String(geradorIDComponente.pegarProximoID()));
    repositorioComponentes.adicionar(componente);
    diagrama?.appendChild(componente.htmlComponente);
  });
}

tiposDiagrama?.innerText
  ?.substring(1, tiposDiagrama?.innerText.length - 1)
  .toLowerCase()
  .split(",")
  .forEach((tipo: string): void => {
    tipo = tipo.trim();
    if (tipo !== "") {
      carregadorDiagrama
        .carregarDiagrama(tipo, callbackCriarComponente)
        .then((fieldset: HTMLFieldSetElement): void => {
          sectionComponentes?.append(fieldset);
        });

      inputsCarregarDiagrama.forEach((input: HTMLInputElement): void => {
        if (input.value.toLowerCase() === tipo) {
          input.checked = true;
          input.disabled = true;
        }
      });
    }
  });

inputsCarregarDiagrama.forEach((input: HTMLInputElement): void => {
  input.addEventListener("click", (event: Event): void => {
    let elementoAlvo: HTMLInputElement = event.target as HTMLInputElement;
    carregadorDiagrama
      .carregarDiagrama(elementoAlvo.value.toLowerCase(), callbackCriarComponente)
      .then((fieldset: HTMLFieldSetElement): void => {
        sectionComponentes?.append(fieldset);
        // TODO: Criar maneira para remover botões
        input.disabled = true;
      });
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
    let command: ColarComponenteCommand = new ColarComponenteDiagramaBuilder()
      .definirFabricaComponente(fabricaComponente)
      .definirGeradorID(geradorIDComponente)
      .definirRegistradorEventos(registrarEventosComponente)
      .definirRepositorioComponente(repositorioComponentes)
      .definirPaiComponente(diagrama)
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

      if (componenteAlvo !== null) {
        repositorioComponentes.remover(componenteAlvo);
        selecionadorComponente.removerSelecao();
        limparPropriedades(abaPropriedades);
        atualizarInputs(selecionadorComponente.pegarHTMLElementoSelecionado(), inputs);
      }
      break;

    // Mover elemento
    case bindings.get("moverElementoParaCima"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.CIMA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      break;

    case bindings.get("moverElementoParaBaixo"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.BAIXO,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      break;

    case bindings.get("moverElementoParaDireita"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.DIREITA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      break;

    case bindings.get("moverElementoParaEsquerda"):
      moverComponente(
        selecionadorComponente.componenteSelecionado,
        DirecoesMovimento.ESQUERDA,
        incrementoMovimentacao,
      );
      selecionadorComponente.moverSetasParaComponenteSelecionado();
      break;
  }

  teclaAnterior = event.key;
});
