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

import PropriedadeFactory from "infrastructure/factory/propriedadeFactory";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import ValoresJSONComponente from "model/json/valoresJSONComponente";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";

export default class ComponenteFactory {
  public static PROPRIEDADE_ID_COMPONENTE: string = "data-id";
  public static PROPRIEDADE_NOME_COMPONENTE: string = "data-nome-componente";
  public static PROPRIEDADE_RECEBE_PONTOS_EXTENSORES: string = "data-recebe-pontos-extensores";
  public static PROPRIEDADE_RECEBE_SETAS_CONECTORAS: string = "data-recebe-setas-conectoras";

  private async pegarJSON(nomeComponente: string): Promise<ValoresJSONComponente> {
    return await fetch(`/elementos/${nomeComponente.toLowerCase()}.json`).then(
      (response: Response): Promise<ValoresJSONComponente> => response.json(),
    );
  }

  public async criarComponente(nomeComponente: string): Promise<ComponenteDiagrama> {
    return this.pegarJSON(nomeComponente).then(
      async (valores: ValoresJSONComponente): Promise<ComponenteDiagrama> => {
        let fabricaPropriedade: PropriedadeFactory = new PropriedadeFactory();
        let elementoHTML: HTMLDivElement = document.createElement("div");
        elementoHTML.innerHTML = valores.valorHtmlInterno;
        elementoHTML.setAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE, nomeComponente);
        elementoHTML.setAttribute(
          ComponenteFactory.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES,
          valores.recebePontoExtensor,
        );
        elementoHTML.setAttribute(
          ComponenteFactory.PROPRIEDADE_RECEBE_SETAS_CONECTORAS,
          valores.recebeSetaConectora,
        );
        elementoHTML.classList.add(ComponenteDiagrama.CLASSE_BASE_COMPONENTE);
        elementoHTML.classList.add(...valores.classesElemento);
        let componente: ComponenteDiagrama = new ComponenteDiagrama(elementoHTML, []);
        for (const propriedade of valores.propriedades) {
          let label: string = await traduzirChaveI18n(propriedade.chaveI18nLabel);

          let propriedadeComponente: PropriedadeComponente | null =
            fabricaPropriedade.criarPropriedade(
              propriedade.nomePropriedade,
              propriedade.sufixo,
              componente,
              label,
              propriedade.classeElemento,
              propriedade.chavesI18nLabelsValoresPermitidos,
              propriedade.valoresPermitidos,
            );
          if (propriedadeComponente !== null) {
            componente.propriedades.push(propriedadeComponente);
          }
        }

        return componente;
      },
    );
  }
}
