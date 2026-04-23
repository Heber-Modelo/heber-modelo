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

export default class RegistradorEventosElemento {
  private _callbacksElemento: { [eventType: string]: [(event: Event | any) => void] } = {};

  public adicionarCallback<K extends keyof HTMLElementEventMap, T extends Event>(
    eventType: K,
    callback: (event: T) => void,
  ): void {
    if (!this._callbacksElemento[eventType]) {
      this._callbacksElemento[eventType] = [callback];
      return;
    }

    this._callbacksElemento[eventType].push(callback);
  }

  public registrarEventos(elemento: HTMLElement): void {
    for (let eventType in this._callbacksElemento) {
      for (let callback of this._callbacksElemento[eventType]) {
        elemento.addEventListener(eventType as keyof HTMLElementEventMap, callback);
      }
    }
  }
}
