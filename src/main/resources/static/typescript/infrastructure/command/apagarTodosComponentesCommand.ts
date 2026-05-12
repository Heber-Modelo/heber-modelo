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

import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import CommandBuilderException from "model/exception/commandBuilderException";
import ComponenteFactory from "infrastructure/factory/componenteFactory";

export default class ApagarTodosComponentesCommand implements ICommand {
  private readonly _repositorioComponente: IRepositorioComponente;
  private readonly _diagrama: HTMLElement;
  private _componentes: ComponenteDiagrama[] = [];

  constructor(repositorioComponente: IRepositorioComponente, diagrama: HTMLElement) {
    this._repositorioComponente = repositorioComponente;
    this._diagrama = diagrama;
  }

  execute(): CommandResult {
    let elementos: NodeListOf<HTMLElement> = document.querySelectorAll(".componente");
    elementos.forEach((elemento: HTMLElement): void => {
      elemento.remove();
      let idComponente: string | null = elemento.getAttribute(
        ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
      );
      if (idComponente) {
        let componente: ComponenteDiagrama = this._repositorioComponente.pegar(
          Number(idComponente),
        ) as ComponenteDiagrama;
        this._repositorioComponente.remover(componente);
        this._componentes.push(componente);
      }
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
  private _repositorioComponente: IRepositorioComponente | null = null;
  private _diagrama: HTMLElement | null | undefined = null;

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirRepositorioComponente(repositorio: IRepositorioComponente): this {
    this._repositorioComponente = repositorio;

    return this;
  }

  build(): ApagarTodosComponentesCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._repositorioComponente === null) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
    }

    return new ApagarTodosComponentesCommand(this._repositorioComponente, this._diagrama);
  }
}
