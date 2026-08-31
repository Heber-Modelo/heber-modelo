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

import "quill/dist/quill.snow.css";
import Quill from "quill";

let quillEditorContainer: HTMLElement | null = document.querySelector(".description-field div");

if (quillEditorContainer) {
  new Quill(quillEditorContainer, {
    theme: "snow",
    formats: ["align", "bold", "color", "indent", "italic", "size", "underline"],
    modules: {
      toolbar: [
        [{ size: [] }],
        ["bold", "italic", "underline", { color: [] }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
      ],
    },
  });
}

let tituloInput: HTMLInputElement | null = document.querySelector("input[name='title']");
let dataPostagemInput: HTMLInputElement | null = document.querySelector(
  "input[name='posting-date']",
);
let dataLimiteInput: HTMLInputElement | null = document.querySelector("input[name='deadline']");
let descricaoInput: HTMLInputElement | null = document.querySelector(".ql-editor");
let inputsRadios: NodeListOf<HTMLInputElement> =
  document.querySelectorAll("input[type='checkbox']");

await fetch("/criarAtividade", {});
