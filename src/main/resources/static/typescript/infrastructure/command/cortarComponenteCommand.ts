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

import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import SelecionadorComponente from "application/paginas/editor/selecionadorComponente";
import RepositorioComponente from "infrastructure/repositorio/repositorioComponente";
import CommandBuilderException from "model/exception/commandBuilderException";

export default class CortarComponenteCommand implements ICommand {
  private readonly _componente: ComponenteDiagrama;
  private _paiComponente: ParentNode | null;
  private _repositorio: RepositorioComponente;
  private _selecionadorComponente: SelecionadorComponente;

  constructor(
    componente: ComponenteDiagrama,
    repositorio: RepositorioComponente,
    selecionadorComponente: SelecionadorComponente,
  ) {
    this._componente = componente;
    this._paiComponente = componente.htmlComponente.parentNode;
    this._repositorio = repositorio;
    this._selecionadorComponente = selecionadorComponente;
  }

  execute(): CommandResult {
    navigator.clipboard
      .writeText(this._componente.htmlComponente.outerHTML)
      .then((): void => {})
      .catch((): void => {});

    this._selecionadorComponente.removerSelecao();
    this._componente.htmlComponente.remove();
    this._repositorio.remover(this._componente);

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._paiComponente?.append(this._componente.htmlComponente);
    this._selecionadorComponente.selecionarElemento(this._componente);
    this._repositorio.adicionar(this._componente);

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class CortarComponenteCommandBuilder implements ICommandBuilder<CortarComponenteCommand> {
  private _componente: ComponenteDiagrama | null = null;
  private _repositorio: RepositorioComponente | null = null;
  private _selecionadorComponente: SelecionadorComponente | null = null;

  definirComponenteAlvo(componente: ComponenteDiagrama | null): this {
    this._componente = componente;
    return this;
  }

  definirRepositorioComponente(repositorio: RepositorioComponente): this {
    this._repositorio = repositorio;
    return this;
  }

  definirSelecionadorComponente(selecionadorComponente: SelecionadorComponente): this {
    this._selecionadorComponente = selecionadorComponente;
    return this;
  }

  build(): CortarComponenteCommand {
    if (this._componente === null) {
      throw new CommandBuilderException("Componente alvo não foi especificado");
    }

    if (this._repositorio === null) {
      throw new CommandBuilderException("Repositório de componentes não foi especificado");
    }

    if (this._selecionadorComponente === null) {
      throw new CommandBuilderException("Selecionador componente não foi especificado");
    }

    return new CortarComponenteCommand(
      this._componente,
      this._repositorio,
      this._selecionadorComponente,
    );
  }
}
