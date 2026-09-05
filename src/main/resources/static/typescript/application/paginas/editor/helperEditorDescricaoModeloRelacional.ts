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

let diagrama: HTMLElement | null = document.querySelector("main");

const editorMutationObserver: MutationObserver = new MutationObserver(ativarEditorModeloRelacional);

async function ativarEditorModeloRelacional(): Promise<void> {
  let targetEditor: HTMLElement | null = document.querySelector(
    ".elemento-editor-descricao-relacional:not(:has(div.ql-snow)) div",
  );

  if (!targetEditor) {
    return;
  }

  const { default: Quill } = await import("quill/core");
  const { default: Toolbar } = await import("quill/modules/toolbar");
  const { default: Snow } = await import("quill/themes/snow");

  const { default: Bold } = await import("quill/formats/bold");
  const { default: Indent } = await import("quill/formats/indent");
  const { default: Italic } = await import("quill/formats/italic");
  const { default: Underline } = await import("quill/formats/underline");

  const { AlignStyle } = await import("quill/formats/align");
  const { ColorStyle } = await import("quill/formats/color");
  const { SizeStyle } = await import("quill/formats/size");

  Quill.register({
    "modules/toolbar": Toolbar,
    "themes/snow": Snow,
    "formats/align": AlignStyle,
    "formats/bold": Bold,
    "formats/color": ColorStyle,
    "formats/indent": Indent,
    "formats/italic": Italic,
    "formats/size": SizeStyle,
    "formats/underline": Underline,
  });

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
