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

import TiposConexao from "model/conexao/tiposConexao";

export default class SeletorTipoConexao {
  static readonly ID_SELETOR: string = "#seletor-tipos-conexao";
  static readonly NOME_SELETOR: string = "tipo-conexao";
  private readonly _elemento: HTMLDivElement;
  private readonly _inputs: NodeListOf<HTMLInputElement>;

  constructor() {
    this._elemento = document.querySelector(SeletorTipoConexao.ID_SELETOR) as HTMLDivElement;

    for (let tipoConexao in TiposConexao) {
      let inputSeletorTipoConexao: HTMLInputElement = document.createElement("input");

      inputSeletorTipoConexao.type = "radio";
      inputSeletorTipoConexao.name = SeletorTipoConexao.NOME_SELETOR;
      inputSeletorTipoConexao.value = tipoConexao;

      let labelSeletorTipoConexao: HTMLLabelElement = document.createElement("label");
      labelSeletorTipoConexao.innerHTML = `<span>${tipoConexao.replaceAll("_", " ").toUpperCase()}</span>`;
      labelSeletorTipoConexao.prepend(inputSeletorTipoConexao);
      this._elemento.appendChild(labelSeletorTipoConexao);
    }

    this._inputs = this._elemento.querySelectorAll("label input");
    this._inputs.item(0).defaultChecked = true;
  }

  public esconderSeletor(): void {
    this._elemento.style.setProperty("display", "none");
  }

  public mostrarSeletor(): void {
    this._elemento.style.removeProperty("display");
  }

  get tipoConexaoAtual(): TiposConexao {
    for (const input of this._inputs) {
      if (input.checked) {
        return TiposConexao[input.value as keyof typeof TiposConexao];
      }
    }

    return TiposConexao.CONEXAO_ANGULADA;
  }
}
