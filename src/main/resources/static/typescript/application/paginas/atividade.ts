/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

async function deletarAtividade(): Promise<void> {
  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";

  let partesURL: string[] = window.location.href.split("/");
  let codigoAtividade: number = Number(partesURL[partesURL.length - 1]);

  if (window.confirm(await traduzirChaveI18n("web.page.assignment.confirm-deletion"))) {
    let response: Response = await fetch(`/atividade/${codigoAtividade}`, {
      method: "DELETE",
      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
      credentials: "same-origin",
    });

    if (response.ok) {
      window.location.href = "listagemAtividades";
    }
  }
}

let deleteAssignmentButton: HTMLButtonElement | null = document.querySelector("#delete-assignment");
deleteAssignmentButton?.addEventListener("click", deletarAtividade);
