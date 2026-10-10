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

import ComponenteFactory from "infrastructure/factory/componenteFactory";
import RepositorioComponenteFactory from "infrastructure/factory/repositorioComponenteFactory";
import selecionadorComponenteFactory from "infrastructure/factory/selecionadorComponenteFactory";
import RepositorioComponente from "infrastructure/repositorio/repositorioComponente";
import SelecionadorComponente from "infrastructure/selecionador/selecionadorComponente";
import AbstractComponenteConexao from "domain/model/componente/abstractComponenteConexao";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import ComponenteDiagramaOuvinte from "domain/model/componente/componenteDiagramaOuvinte";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";

export function limparPropriedades(abaPropriedades: HTMLElement | null): void {
  if (abaPropriedades === null) return;

  let propriedades: NodeListOf<HTMLElement> = abaPropriedades.querySelectorAll(
    `.${PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA}`,
  );
  propriedades.forEach((propriedade: HTMLElement): void => propriedade.remove());
}

function adicionarPropriedades(
  abaPropriedades: HTMLElement | null,
  propriedades: PropriedadeComponente[],
): void {
  propriedades.forEach((propriedade: PropriedadeComponente): void => {
    let editorPropriedade: HTMLLabelElement = propriedade.criarElementoInputPropriedade();
    abaPropriedades?.appendChild(editorPropriedade);
  });
}

export function mouseDownSelecionarElemento(event: Event): void {
  let selecionador: SelecionadorComponente = selecionadorComponenteFactory.build();
  let repositorio: RepositorioComponente = RepositorioComponenteFactory.build();
  let abaPropriedades: HTMLElement | null = document.querySelector("section#propriedades");
  let componente: ComponenteDiagrama | null = repositorio.pegarPorHTML(event.target as HTMLElement);

  if (componente === null) {
    return;
  }

  selecionador.selecionarElemento(componente);
  limparPropriedades(abaPropriedades);
  adicionarPropriedades(abaPropriedades, componente.propriedades);

  componente.ouvintes.forEach((ouvinte: ComponenteDiagramaOuvinte): void => {
    if (ouvinte instanceof ComponenteDiagrama && !(ouvinte instanceof AbstractComponenteConexao)) {
      adicionarPropriedades(abaPropriedades, ouvinte.propriedades);
    }
  });

  let recebePontosExtensores: string | null = componente.htmlComponente.getAttribute(
    ComponenteFactory.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES,
  );

  if (recebePontosExtensores === "false") {
    selecionador.esconderPontosExtensores();
  }
}
