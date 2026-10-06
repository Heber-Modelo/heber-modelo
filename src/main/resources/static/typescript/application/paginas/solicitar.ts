/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";

let formElement: HTMLFormElement | null = document.querySelector("form");
let inputsDigitosToken: NodeListOf<HTMLInputElement> =
  document.querySelectorAll("input[name='token[]']");

for (let i: number = 0; i < inputsDigitosToken.length; i++) {
  const inputDigitoToken: HTMLInputElement = inputsDigitosToken[i];
  inputDigitoToken.addEventListener("input", (event: InputEvent): void => {
    let inputTarget: HTMLInputElement = event.target as HTMLInputElement;

    if (inputTarget.value.length === 1) {
      inputTarget.value = inputTarget.value.toUpperCase();
    }

    if (inputTarget.value.length === 1 && i !== inputsDigitosToken.length - 1) {
      inputsDigitosToken[i + 1].focus();
    }
  });

  inputDigitoToken.addEventListener("keydown", (event: KeyboardEvent): void => {
    if (event.key === "Backspace" && i !== 0 && inputsDigitosToken[i].value.length === 0) {
      inputsDigitosToken[i - 1].focus();
    }
  });
}

formElement?.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();

  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";
  let token: string = "";

  for (const inputDigitoToken of inputsDigitosToken) {
    token += inputDigitoToken.value;
  }

  let response: Response = await fetch("/solicitar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    credentials: "same-origin",
    body: JSON.stringify({
      token: token,
    }),
  });

  if (response.ok) {
    window.location.href = "/redefinir";
  }

  window.alert(await traduzirChaveI18n("web.page.request-password-change.wrong-code"));
});
