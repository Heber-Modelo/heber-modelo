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

import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.AUTORIZADO;
import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.BLOQUEADO;
import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.ESPERANDO;
import static io.github.heberbarra.modelador.infrastructure.acessador.AcessadorSegundosTimeoutTeste.ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER;
import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha.VERIFICADOR_SENHA_HEADER;
import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorTokenTrocarSenha.VERIFICAR_TOKEN_TROCAR_SENHA_HEADER;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.router.Roteador;
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.Objects;
import java.util.logging.Logger;

public class RoteadorSessaoEstudante implements Roteador {
    private static final Logger logger = JavaLogger.obterLogger(RoteadorSessaoEstudante.class.getName());
    public Socket socket;
    private final int porta;
    private final String ip;
    private final String senha;
    private static volatile String dados;
    private static volatile String headerDados;
    private EstadosRoteador estadoRoteador;
    private volatile EstadosRoteador estadoTrocarSenha;
    private volatile Long segundosTimeout;

    public RoteadorSessaoEstudante(int porta, String ip, String senha) {
        this.porta = porta;
        this.ip = ip;
        this.senha = senha;
        this.estadoRoteador = ESPERANDO;
        this.estadoTrocarSenha = ESPERANDO;
    }

    @Override
    public void run() {
        SessaoFactory.reiniciarFactory();
        socket = SessaoFactory.build(this.porta, this.ip);

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))) {
            writer.write("%s;%s;%n".formatted(VERIFICADOR_SENHA_HEADER, senha));
            writer.flush();

            String resposta;
            while ((resposta = reader.readLine()) == null) {
                //noinspection BusyWait
                Thread.sleep(200);
            }

            String[] partesResposta = resposta.split(SEPARADOR_MENSAGEM);
            String header = partesResposta[POSICAO_HEADER];

            if (Objects.equals(VERIFICADOR_SENHA_HEADER, header) && !(Boolean.parseBoolean(partesResposta[1]))) {
                this.estadoRoteador = BLOQUEADO;
                logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.session.connection.failure"));

                return;
            }

            this.estadoRoteador = AUTORIZADO;
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("session.connection.success"));

            //noinspection InfiniteLoopStatement
            while (true) {
                if (headerDados == null) {
                    //noinspection BusyWait
                    Thread.sleep(200);
                    continue;
                }

                writer.write("%s;%s;%n".formatted(headerDados, dados));
                writer.flush();

                headerDados = null;
                dados = null;

                while ((resposta = reader.readLine()) == null) {
                    //noinspection BusyWait
                    Thread.sleep(200);
                }

                partesResposta = resposta.split(SEPARADOR_MENSAGEM);
                header = partesResposta[POSICAO_HEADER];

                if (Objects.equals(ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER, header)) {
                    segundosTimeout = Long.parseLong(partesResposta[1]);
                }

                if (Objects.equals(VERIFICAR_TOKEN_TROCAR_SENHA_HEADER, header)) {
                    this.estadoTrocarSenha = Boolean.parseBoolean(partesResposta[1]) ? AUTORIZADO : BLOQUEADO;
                }
            }

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

    @Override
    public EstadosRoteador getEstado() {
        return estadoRoteador;
    }

    public EstadosRoteador getEstadoTrocarSenha() {
        return estadoTrocarSenha;
    }

    public void setEstadoTrocarSenha(EstadosRoteador estadoTrocarSenha) {
        this.estadoTrocarSenha = estadoTrocarSenha;
    }

    public Long getSegundosTimeout() {
        return segundosTimeout;
    }

    public static void setDados(String dados) {
        RoteadorSessaoEstudante.dados = dados;
    }

    public static void setHeaderDados(String headerDados) {
        RoteadorSessaoEstudante.headerDados = headerDados;
    }
}
