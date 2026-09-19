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

package io.github.heberbarra.modelador.infrastructure.router;

import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha.VERIFICADOR_SENHA_HEADER;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.model.Sessao;
import io.github.heberbarra.modelador.domain.router.Roteador;
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Objects;
import java.util.logging.Logger;

public class RoteadorSessaoEstudante implements Roteador {
    private static final Logger logger = JavaLogger.obterLogger(RoteadorSessaoEstudante.class.getName());
    public Sessao sessao;
    private final int porta;
    private final String ip;
    private final String senha;

    public RoteadorSessaoEstudante(int porta, String ip, String senha) {
        this.porta = porta;
        this.ip = ip;
        this.senha = senha;
    }

    @Override
    public void run() {
        this.sessao = SessaoFactory.build(this.porta, this.ip, this.senha);

        try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(this.sessao.getSocket().getInputStream()));
                BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(this.sessao.getSocket().getOutputStream()))) {
            writer.write("%s;%s;%s%n".formatted(VERIFICADOR_SENHA_HEADER, ip, senha));
            Thread.sleep(200);
            String resposta = reader.readLine();
            String[] partesResposta = resposta.split(SEPARADOR_MENSAGEM);
            String header = partesResposta[POSICAO_HEADER];
            String ip = partesResposta[POSICAO_IP];

            if (Objects.equals(VERIFICADOR_SENHA_HEADER, header)
                    && Objects.equals(this.ip, ip)
                    && !(Boolean.parseBoolean(partesResposta[2]))) {
                sessao.getSocket().close();
                logger.warning("Senha incorreta! Sessão desconectada");

                return;
            }

            logger.info("Senha correta!");
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.read")
                    .formatted(e.getMessage()));
        } catch (InterruptedException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.router.interrupted")
                    .formatted(e.getMessage()));
        }
    }
}
