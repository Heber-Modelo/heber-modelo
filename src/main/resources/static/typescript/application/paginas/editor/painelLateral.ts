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

class PainelLateral {
  public readonly CLASSE_PAINEL_OCULTO: string = "hidden";

  constructor(
    painel: HTMLElement | null,
    btnEsconderPainel: HTMLButtonElement | null,
    btnMostrarPainel: HTMLButtonElement | null,
  ) {
    btnEsconderPainel?.addEventListener("click", () => this.esconderPainel(painel));
    btnMostrarPainel?.addEventListener("click", () => this.mostrarPainel(painel));
  }

  private esconderPainel(painel: HTMLElement | null): void {
    painel?.classList.add(this.CLASSE_PAINEL_OCULTO);
    painel?.style.setProperty("border", "none");
  }

  private mostrarPainel(painel: HTMLElement | null): void {
    painel?.classList.remove(this.CLASSE_PAINEL_OCULTO);
    painel?.style.removeProperty("border");
  }
}

function configurarPainel(id: string): void {
  let painel: HTMLElement | null = document.querySelector(id);
  let btnEsconder: HTMLButtonElement | null = document.querySelector(`${id} .btn-esconder`);
  let btnMostrar: HTMLButtonElement | null = document.querySelector(`${id} .btn-mostrar`);

  new PainelLateral(painel, btnEsconder, btnMostrar);
}

configurarPainel("#painel-direito");
configurarPainel("#painel-esquerdo");
