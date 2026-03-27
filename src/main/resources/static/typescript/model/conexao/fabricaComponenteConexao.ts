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

import AbstractComponenteConexao from "model/conexao/abstractComponenteConexao.js";
import ComponenteConexaoAngulada from "model/conexao/componenteConexaoAngulada.js";
import ComponenteConexaoReta from "model/conexao/componenteConexaoReta.js";
import ComponenteDiagrama, { LateralComponente } from "model/componente/componenteDiagrama.js";
import Ponto from "model/ponto.js";
import PropriedadeComponente from "model/propriedade/propriedadeComponente.js";
import TipoConexao from "model/conexao/tipoConexao.js";

export default class FabricaComponenteConexao {
  public criarConexao(
    tipoConexao: TipoConexao,
    componenteHTML: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    ponto1: Ponto,
    ponto2: Ponto,
    lateralPrimeiroComponente: LateralComponente,
    lateralSegundoComponente: LateralComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
  ): AbstractComponenteConexao {
    switch (tipoConexao) {
      case TipoConexao.CONEXAO_SETA:
      case TipoConexao.CONEXAO_ENTIDADE_FRACA:
      case TipoConexao.CONEXAO_ANGULADA:
        return new ComponenteConexaoAngulada(
          componenteHTML,
          propriedades,
          ponto1,
          ponto2,
          lateralPrimeiroComponente,
          lateralSegundoComponente,
          primeiroComponente,
          segundoComponente,
        );

      case TipoConexao.CONEXAO_RETA:
        return new ComponenteConexaoReta(
          componenteHTML,
          propriedades,
          ponto1,
          ponto2,
          lateralPrimeiroComponente,
          lateralSegundoComponente,
          primeiroComponente,
          segundoComponente,
        );
    }
  }
}
