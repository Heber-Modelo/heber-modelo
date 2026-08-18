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

import LateraisComponente from "domain/enum/lateraisComponente";

export default function pegarLateralComponenteOposta(
  lateralComponente: LateraisComponente,
): LateraisComponente {
  switch (lateralComponente) {
    case LateraisComponente.NORTE:
      return LateraisComponente.SUL;

    case LateraisComponente.SUL:
      return LateraisComponente.NORTE;

    case LateraisComponente.LESTE:
      return LateraisComponente.OESTE;

    case LateraisComponente.OESTE:
      return LateraisComponente.LESTE;
  }
}
