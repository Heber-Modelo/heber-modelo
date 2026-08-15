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

let diagrama: HTMLElement | null = document.querySelector("main");

const editorMutationObserver: MutationObserver = new MutationObserver(ativarEditorModeloRelacional);

function ativarEditorModeloRelacional(): void {
  let targetEditor: HTMLElement | null = document.querySelector(
    ".elemento-editor-descricao-relacional:not(:has(div.ql-snow)) div",
  );

  if (!targetEditor) {
    return;
  }

  editorMutationObserver.disconnect();
  new Quill(targetEditor, {
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

  setTimeout((): void => {
    if (diagrama) {
      editorMutationObserver.observe(diagrama, { childList: true, subtree: true });
    }
  }, 1000);
}

if (diagrama) {
  editorMutationObserver.observe(diagrama, { childList: true, subtree: true });
}
