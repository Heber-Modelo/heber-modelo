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

import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import Aba from "domain/model/aba";

export default async function criarAba(
  id: number,
  callbackFecharAba: (event: MouseEvent) => void,
): Promise<Aba> {
  let htmlElementNovaAba: HTMLDivElement = document.createElement("div");
  let pFechar: HTMLParagraphElement = document.createElement("p");
  let labelAba: HTMLParagraphElement = document.createElement("p");

  htmlElementNovaAba.classList.add(Aba.CLASSE_ABA);
  htmlElementNovaAba.setAttribute(Aba.ATRIBUTO_INDICE_ABA, `${id}`);

  pFechar.innerText = "x";
  pFechar.addEventListener("click", callbackFecharAba);

  labelAba.classList.add(Aba.CLASSE_NUMERO_ABA);
  labelAba.innerText = `${await traduzirChaveI18n("web.page.editor.label.tab")} ${id}`;
  labelAba.setAttribute("contenteditable", "true");

  htmlElementNovaAba.append(labelAba);
  htmlElementNovaAba.append(pFechar);

  return new Aba(id, htmlElementNovaAba);
}
