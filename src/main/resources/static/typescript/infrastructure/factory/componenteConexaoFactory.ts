/*
 * Copyright (c) 2025-2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import AbstractComponenteConexao from "model/conexao/abstractComponenteConexao";
import ComponenteConexaoAngulada from "model/conexao/componenteConexaoAngulada";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import ComponenteConexaoReta from "model/conexao/componenteConexaoReta";
import TiposConexao from "model/conexao/tiposConexao";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";
import Ponto from "model/ponto";

export default class ComponenteConexaoFactory {
  public criarConexao(
    tipoConexao: TiposConexao,
    componenteHTML: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    ponto1: Ponto,
    ponto2: Ponto,
    lateralPrimeiroComponente: LateraisComponente,
    lateralSegundoComponente: LateraisComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
  ): AbstractComponenteConexao {
    switch (tipoConexao) {
      case TiposConexao.CONEXAO_SETA:
      case TiposConexao.CONEXAO_ENTIDADE_FRACA:
      case TiposConexao.CONEXAO_ANGULADA:
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

      case TiposConexao.CONEXAO_RETA:
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
