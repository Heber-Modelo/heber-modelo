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

import GeradorIDAba from "infrastructure/gerador/geradorIDAba";
import GeradorIDAbaFactory from "infrastructure/factory/geradorIDAbaFactory";
import RepositorioAbasFactory from "infrastructure/factory/repositorioAbasFactory";
import SelecionadorAbaFactory from "infrastructure/factory/selecionadorAbaFactory";
import RepositorioAbas from "infrastructure/repositorio/repositorioAbas";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import Aba from "model/aba";

let geradorIDAba: GeradorIDAba = GeradorIDAbaFactory.build();
let repositorioAbas: RepositorioAbas = RepositorioAbasFactory.build();
let selecionadorAba: SelecionadorAba = SelecionadorAbaFactory.build();

let buttonNovaAba: HTMLDivElement | null = document.querySelector("#nova-aba");
let seletorAbas: HTMLElement | null = document.querySelector("footer div");
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
  let htmlElementNovaAba: HTMLDivElement = document.createElement("div");
  let btnFechar: HTMLParagraphElement = document.createElement("p");
  let tabLabel: HTMLParagraphElement = document.createElement("p");

  htmlElementNovaAba.classList.add(Aba.CLASSE_ABA);
  htmlElementNovaAba.setAttribute(Aba.ATRIBUTO_INDICE_ABA, `${geradorIDAba.pegarProximoID()}`);

  btnFechar.innerText = "x";
  btnFechar.addEventListener("click", fecharAba);

  tabLabel.classList.add(Aba.CLASSE_NUMERO_ABA);
  tabLabel.innerText = `${await traduzirChaveI18n("web.page.editor.label.tab")} ${geradorIDAba.id}`;
  tabLabel.setAttribute("contenteditable", "true");

  htmlElementNovaAba.append(tabLabel);
  htmlElementNovaAba.append(btnFechar);
  seletorAbas?.append(htmlElementNovaAba);

  let novaAba: Aba = new Aba(geradorIDAba.id, htmlElementNovaAba);
  repositorioAbas.adicionar(novaAba);

  htmlElementNovaAba.addEventListener("click", (): void => {
    selecionadorAba.selecionarAba(novaAba);
  });
});
