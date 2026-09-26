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

package io.github.heberbarra.modelador.domain.router;

public interface Roteador extends Runnable {
    String ENCERRAR_ROUTER = "ENCERRAR";
    String SEPARADOR_MENSAGEM = ";";
    int POSICAO_HEADER = 0;
    int POSICAO_IP = 1;

    enum EstadosRoteador {
        AUTORIZADO,
        BLOQUEADO,
        ESPERANDO
    }

    EstadosRoteador getEstado();
}
