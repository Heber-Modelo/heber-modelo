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

const divAutoresDiagrama: HTMLDivElement | null = document.querySelector("#autor-diagrama");
const divEmailsDiagrama: HTMLDivElement | null = document.querySelector("#email-diagrama");
const divTiposDiagrama: HTMLDivElement | null = document.querySelector("#tipos-diagrama");

function separarStringLista(texto: string | undefined): string[] {
  if (texto === undefined) {
    return [];
  }

  return texto
    .substring(1, texto.length - 1)
    .split(",")
    .map((s: string): string => s.trim());
}

type AuthorXML = {
  "author-name": string;
  "author-email": string;
};

type DiagramaTypeXML = {
  "diagram-type": string;
};

async function salvar(): Promise<void> {
  let autoresDiagrama: string[] = separarStringLista(divAutoresDiagrama?.innerText);
  let emailsDiagrama: string[] = separarStringLista(divEmailsDiagrama?.innerText);
  let tiposDiagrama: string[] = separarStringLista(divTiposDiagrama?.innerText);

  let authors: AuthorXML[] = [];
  for (let i: number = 0; i < autoresDiagrama.length; i++) {
    authors.push({
      "author-name": autoresDiagrama[i],
      "author-email": emailsDiagrama[i] || "",
    });
  }

  let diagramTypes: DiagramaTypeXML[] = tiposDiagrama.map(
    (tipo: string): DiagramaTypeXML => ({ "diagram-type": tipo }),
  );

  await fetch("/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authors: authors,
      types: diagramTypes,
      "creation-date": Date.now(),
      "last-modification": Date.now(),
      links: [],
      pages: [],
    }),
  });
}
