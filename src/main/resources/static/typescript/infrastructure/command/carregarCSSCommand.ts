/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import ICommand from "../../model/command/iCommand.js";

export const ATRIBUTO_NOME_ARQUIVO = "arquivo";
export const CLASSE_LINK_CSS_ELEMENTO = "css-carregado";

class CacheCSSElementos {
  private static _cache: string[] = [];

  static insert(nome: string): void {
    this._cache.push(nome);
  }

  static includes(nome: string): boolean {
    return this._cache.includes(nome);
  }

  static remove(nome: string): void {
    this._cache = this._cache.filter((valor: string) => valor !== nome);
  }
}

export default class CarregarCSSCommand implements ICommand {
  private readonly _nomeArquivo: string;
  private _linkElement: HTMLLinkElement | null = null;

  constructor(nomeArquivo: string) {
    nomeArquivo = this.ajustarNomeArquivo(nomeArquivo);

    if (!this.validarNomeArquivo(nomeArquivo)) {
      throw new Error("O nome passado é inválido");
    }

    this._nomeArquivo = nomeArquivo;
  }

  private ajustarNomeArquivo(nomeArquivo: string): string {
    if (!nomeArquivo.endsWith(".css")) {
      nomeArquivo += ".css";
    }

    return nomeArquivo;
  }

  private validarNomeArquivo(nomeArquivo: string): boolean {
    const regexValidator = /[a-z_]+.css/;
    return nomeArquivo.match(regexValidator)?.at(0) === nomeArquivo;
  }

  execute(): Number {
    if (
      document.head.contains(this._linkElement) ||
      CacheCSSElementos.includes(this._nomeArquivo)
    ) {
      return 0;
    }

    if (this._linkElement === null) {
      this._linkElement = document.createElement("link");
      this._linkElement.classList.add(CLASSE_LINK_CSS_ELEMENTO);
      this._linkElement.setAttribute(ATRIBUTO_NOME_ARQUIVO, this._nomeArquivo);
      this._linkElement.rel = "stylesheet";
      this._linkElement.type = "text/css";
      this._linkElement.href = `/css/elementos/${this._nomeArquivo}`;
    }

    document.head.appendChild(this._linkElement);
    CacheCSSElementos.insert(this._nomeArquivo);

    return 0;
  }

  undo(): Number {
    this._linkElement?.remove();

    return 0;
  }
}

export class CarregarCSSCommandBuilder {
  private _nomeArquivo: string | null = null;

  definirNomeArquivo(nomeArquivo: string): this {
    this._nomeArquivo = nomeArquivo;
    return this;
  }

  build(): CarregarCSSCommand {
    if (this._nomeArquivo === null) {
      throw new Error("O nome do arquivo não foi definido");
    }

    return new CarregarCSSCommand(this._nomeArquivo);
  }
}
