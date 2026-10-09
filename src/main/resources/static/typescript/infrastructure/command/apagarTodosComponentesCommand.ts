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

import CommandBuilderException from "domain/exception/commandBuilderException";
import ICommand, { CommandResult } from "domain/model/command/iCommand";
import IRepositorioComponente from "domain/model/repositorio/iRepositorioComponente";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import ICommandBuilder from "domain/model/command/iCommandBuilder";
import IRepositorioAbas from "domain/model/repositorio/iRepositorioAbas";
import Aba from "domain/model/aba";

export default class ApagarTodosComponentesCommand implements ICommand {
  private readonly _diagrama: HTMLElement;
  private readonly _repositorioAba: IRepositorioAbas;
  private readonly _repositorioComponente: IRepositorioComponente;
  private _componentes: ComponenteDiagrama[] = [];

  constructor(
    diagrama: HTMLElement,
    repositorioAba: IRepositorioAbas,
    repositorioComponente: IRepositorioComponente,
  ) {
    this._diagrama = diagrama;
    this._repositorioAba = repositorioAba;
    this._repositorioComponente = repositorioComponente;
  }

  execute(): CommandResult {
    let elementos: NodeListOf<HTMLElement> = document.querySelectorAll(".componente");
    elementos.forEach((elemento: HTMLElement): void => {
      elemento.remove();
      let idComponente: string | null = elemento.getAttribute(
        ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE,
      );

      if (!idComponente) {
        return;
      }

      let componente: ComponenteDiagrama | null = this._repositorioComponente.pegar(
        Number(idComponente),
      );

      if (!componente) {
        return;
      }

      this._repositorioComponente.remover(componente);
      this._componentes.push(componente);
    });

    this._repositorioComponente.limparMemoria();

    this._repositorioAba
      .listar()
      .slice(1)
      .forEach((aba: Aba): void => {
        this._repositorioAba.remover(aba);
      });

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    return this.execute();
  }

  undo(): CommandResult {
    this._componentes.forEach((componente: ComponenteDiagrama): void => {
      this._diagrama.append(componente.htmlComponente);
      this._repositorioComponente.adicionar(componente);
    });

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ApagarTodosComponentesCommandBuilder implements ICommandBuilder<ApagarTodosComponentesCommand> {
  private _diagrama: HTMLElement | null | undefined = null;
  private _repositorioAba: IRepositorioAbas | null = null;
  private _repositorioComponente: IRepositorioComponente | null = null;

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirRepositorioAba(repositorioAba: IRepositorioAbas | null): this {
    this._repositorioAba = repositorioAba;

    return this;
  }

  public definirRepositorioComponente(repositorio: IRepositorioComponente | null): this {
    this._repositorioComponente = repositorio;

    return this;
  }

  public build(): ApagarTodosComponentesCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("diagrama");
    }

    if (this._repositorioAba === null) {
      throw new CommandBuilderException("repositório de abas");
    }

    if (this._repositorioComponente === null) {
      throw new CommandBuilderException("repositório de componentes");
    }

    return new ApagarTodosComponentesCommand(
      this._diagrama,
      this._repositorioAba,
      this._repositorioComponente,
    );
  }
}
