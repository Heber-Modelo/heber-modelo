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

package io.github.heberbarra.modelador.infrastructure.verificador;


import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import io.github.heberbarra.modelador.domain.model.Sessao;
import org.apache.tomcat.jni.Buffer;
import org.springframework.aop.interceptor.ConcurrencyThrottleInterceptor;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.logging.Logger;


public class VerificadorSenha implements Runnable{
    private static final Logger logger = JavaLogger.obterLogger(VerificadorSenha.class.getName());

    public static final String MARCADOR_IP  = "IP:";
    public static final String MARCADOR_SENHA="PASSWORD:";


    private final String senha;

    public VerificadorSenha(String senha) {
        this.senha = senha;
    }

    @Override
    public void run() {

        Sessao sessao = SessaoFactory.getSessao().orElseThrow();

        try (
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(sessao.getSocket().getInputStream()));
            BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(sessao.getSocket().getOutputStream()))
        ) {
            while (true) {
                String linha = bufferedReader.readLine();

                if (!linha.contains(MARCADOR_SENHA)) {
                    Thread.sleep(1000);
                    continue;
                }

                String[] partesLinha = linha.split("\\|");

                if (linha.equals(MARCADOR_SENHA + senha)){
                    logger.info(TradutorWrapper.tradutor.traduzirMensagem("session.password-verify.success"));
                    continue;
                }

            }

        } catch (IOException e) {
            throw new RuntimeException(e);

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }


    }
}
