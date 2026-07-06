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

import ResponseTraducaoJSON from "model/response/responseTraducaoJSON";

export default async function traduzirChaveI18n(chaveI18n: string): Promise<string> {
  return await fetch(`/traducao/${chaveI18n}`)
    .then(async (response: Response): Promise<ResponseTraducaoJSON> => await response.json())
    .then((responseTraducao: ResponseTraducaoJSON): string => responseTraducao.mensagem);
}
