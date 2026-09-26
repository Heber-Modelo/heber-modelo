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

async function encerrarSessao(): Promise<void> {
  let csrfTokenMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfTokenMetaTag?.content || "";

  await fetch("/encerrarSessao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    credentials: "same-origin",
  });

  await fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    credentials: "same-origin",
  });

  window.location.href = "/";
}

const encerrarSessaoButton: HTMLButtonElement | null = document.querySelector("#encerrarSessao");
encerrarSessaoButton?.addEventListener("click", encerrarSessao);

let awaitIndicatorWrapper: HTMLElement | null = document.querySelector("#await-indicator-wrapper");

async function verificarEstadoSessao(): Promise<void> {
  let estado: string = await (await fetch("/verificarEstadoSessao")).text();

  if (estado === "AUTORIZADO") {
    awaitIndicatorWrapper?.remove();
    return;
  }

  awaitIndicatorWrapper?.style.removeProperty("display");
  setTimeout(verificarEstadoSessao, 500);
}

(async (): Promise<void> => await verificarEstadoSessao())();
