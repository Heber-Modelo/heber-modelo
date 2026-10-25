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

import PropriedadeFactory from "infrastructure/factory/propriedadeFactory";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import ValoresJSONComponente from "domain/json/valoresJSONComponente";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";
import NomesComponente from "domain/enum/nomesComponente";
import ComponenteDescricaoRelacional from "domain/model/componente/componenteDescricaoRelacional";
import ComponenteDicionarioDados from "domain/model/componente/componenteDicionarioDados";
import ComponenteTabelaRelacional from "domain/model/componente/componenteTabelaRelacional";

export default class ComponenteFactory {
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
        elementoHTML.setAttribute(ComponenteDiagrama.PROPRIEDADE_NOME_COMPONENTE, nomeComponente);
        elementoHTML.setAttribute(
          ComponenteDiagrama.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES,
          valores.recebePontoExtensor,
        );
        elementoHTML.setAttribute(
          ComponenteDiagrama.PROPRIEDADE_RECEBE_SETAS_CONECTORAS,
          valores.recebeSetaConectora,
        );
        elementoHTML.classList.add(ComponenteDiagrama.CLASSE_BASE_COMPONENTE);
        elementoHTML.classList.add(...valores.classesElemento);

        let componente: ComponenteDiagrama;

        if (nomeComponente === NomesComponente.TABELA_RELACIONAL) {
          componente = new ComponenteTabelaRelacional(elementoHTML, []);
        } else if (nomeComponente === NomesComponente.EDITOR_DESCRICAO_RELACIONAL) {
          componente = new ComponenteDescricaoRelacional(elementoHTML);
        } else if (nomeComponente === NomesComponente.TABELA_DICIONARIO_DADOS) {
          componente = new ComponenteDicionarioDados(elementoHTML);
        } else {
          componente = new ComponenteDiagrama(elementoHTML, []);
        }

        for (const propriedade of valores.propriedades) {
          let label: string = await traduzirChaveI18n(propriedade.chaveI18nLabel);

          if (propriedade.chaveI18nValorInicial) {
            let elementoAlvo: HTMLElement | null = elementoHTML.querySelector(
              `.${propriedade.classeElemento}`,
            );

            if (elementoAlvo) {
              elementoAlvo.innerText = await traduzirChaveI18n(propriedade.chaveI18nValorInicial);
            }
          }

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
