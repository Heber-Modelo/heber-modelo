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

let btnDesligar: HTMLButtonElement | null = document.querySelector("#btn-desligar");
btnDesligar?.addEventListener("click", async (): Promise<void> => {
  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";
  let tokenDesligar: string = document.cookie.split("TOKEN_DESLIGAR=")[1].split(";")[0];

  await fetch(`/desligar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": csrfToken },
    credentials: "same-origin",
    body: JSON.stringify({
      token: tokenDesligar,
    }),
  }).then(async (response: Response): Promise<void> => {
    if (response.ok) {
      window.alert(await fetch("/traducao/app.end"));
    }
  });
});
