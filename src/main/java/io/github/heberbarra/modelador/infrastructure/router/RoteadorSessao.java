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
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.jspecify.annotations.Nullable;

public class RoteadorSessao implements Roteador {
    private static final Logger logger = JavaLogger.obterLogger(RoteadorSessao.class.getName());
    public Map<String, Method> funcionalidadesRegistradas;
    public Map<String, Object> objetosAlvoFuncionalidades;
    public Sessao sessao;
    private final int porta;

    public RoteadorSessao(int porta) {
        this.funcionalidadesRegistradas = new HashMap<>();
        this.objetosAlvoFuncionalidades = new HashMap<>();
        this.porta = porta;
    }

    public void registrarFuncionalidade(String header, @Nullable Object objetoAlvo, Method funcionalidade) {
        this.funcionalidadesRegistradas.put(header, funcionalidade);
        this.objetosAlvoFuncionalidades.put(header, objetoAlvo);
    }

    @Override
    public void run() {
        this.sessao = SessaoFactory.build(porta, null);

        String argumentos;
        String header = null;
        String ip;
        String linha;
        String[] partesLinha;

        try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(this.sessao.socket().getInputStream()));
                BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(this.sessao.socket().getOutputStream()))) {
            while (true) {
                linha = reader.readLine();

                if (linha == null) {
                    continue;
                }

                partesLinha = linha.split(SEPARADOR_MENSAGEM);
                header = partesLinha[POSICAO_HEADER];
                ip = partesLinha[POSICAO_IP];
                argumentos = Arrays.stream(partesLinha).skip(2).collect(Collectors.joining());

                if (Objects.equals(linha, ENCERRAR_ROUTER)) {
                    return;
                }

                Method funcionalidade = this.funcionalidadesRegistradas.get(header);
                Object objetoAlvo = this.objetosAlvoFuncionalidades.get(header);

                if (funcionalidade == null) {
                    //noinspection BusyWait
                    Thread.sleep(500);
                    continue;
                }

                Object resultado = funcionalidade.invoke(objetoAlvo, argumentos);
                writer.write("%s;%s;%s%n".formatted(header, ip, resultado));
                writer.flush();
            }
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.read")
                    .formatted(e.getMessage()));
        } catch (IllegalAccessException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.access.denied.method")
                    .formatted(funcionalidadesRegistradas.get(header).getName(), e.getMessage()));
        } catch (InterruptedException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.router.interrupted")
                    .formatted(e.getMessage()));
        } catch (InvocationTargetException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.router.invocation")
                    .formatted(header, e.getMessage()));
        }
    }
}
