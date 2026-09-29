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

// noinspection DuplicatedCode
import "quill/dist/quill.snow.css";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import("quill/core").then(async ({ default: Quill }): Promise<void> => {
  // noinspection DuplicatedCode
  let quillEditorContainer: HTMLElement | null = document.querySelector(".description-field div");

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

    let assignmentDescription: HTMLParagraphElement | null =
      document.querySelector("#assignment-description");
    let quillEditor: HTMLElement | null = document.querySelector("div.ql-editor");

    if (assignmentDescription && quillEditor) {
      quillEditor.innerHTML = assignmentDescription.innerText;
    }
  }
});

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

async function atualizarAtividade(): Promise<void> {
  let tituloInput: HTMLInputElement | null = document.querySelector("input[name='title']");
  let dataPostagemInput: HTMLInputElement | null = document.querySelector(
    "input[name='posting-date']",
  );
  let dataLimiteInput: HTMLInputElement | null = document.querySelector("input[name='deadline']");
  let descricaoInput: HTMLDivElement | null = document.querySelector(".ql-editor");
  let inputRadioYes: HTMLInputElement | null = document.querySelector(
    "input.botao-radio[value='on']",
  );

  let partesURL: string[] = window.location.href.split("/");
  let codigoAtividade: number = Number(partesURL[partesURL.length - 1]);

  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";

  let response: Response = await fetch(`/atividade/${codigoAtividade}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    credentials: "same-origin",
    body: JSON.stringify({
      titulo: tituloInput?.value,
      dataPostagem: dataPostagemInput?.value,
      dataLimite: dataLimiteInput?.value,
      descricao: descricaoInput?.innerHTML,
      isProva: inputRadioYes?.checked,
    }),
  });

  if (response.ok) {
    window.alert(await traduzirChaveI18n("web.page.assignment.update.success"));
    window.location.href = "/listagemAtividades";
    return;
  }

  window.alert(await traduzirChaveI18n("web.page.assignment.update.failure"));
}

let submitButton: HTMLButtonElement | null = document.querySelector("#save-assignment");
submitButton?.addEventListener("click", atualizarAtividade);
