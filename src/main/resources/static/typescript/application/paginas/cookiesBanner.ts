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

const NOME_STORAGE_COOKIES: string = "esconder-cookies-banner";

document.querySelector("#cookies-banner button")?.addEventListener("click", (e: Event): void => {
  let elementoPai: HTMLElement | null = (e.target as HTMLElement).parentElement;

  if (elementoPai !== null) {
    elementoPai.style.display = "none";
    window.localStorage.setItem(NOME_STORAGE_COOKIES, "1");
  }
});

if (window.localStorage.getItem(NOME_STORAGE_COOKIES) !== null) {
  let cookiesBanner: HTMLElement | null = document.querySelector("#cookies-banner");
  cookiesBanner?.style.setProperty("display", "none");
}
