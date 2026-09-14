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
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class RoteadorSessao extends Thread {
    private static final Logger logger = JavaLogger.obterLogger(RoteadorSessao.class.getName());
    public static final String ENCERRAR_ROUTER = "ENCERRAR";
    public static final String SEPARADOR_MENSAGEM = ";";
    public Map<String, Method> funcionalidadesRegistradas;
    public Sessao sessao;

    public RoteadorSessao() {
        this.funcionalidadesRegistradas = new HashMap<>();
        this.sessao = SessaoFactory.getSessao();
    }

    public void registrarFuncionalidade(String header, Method funcionalidade) {
        this.funcionalidadesRegistradas.put(header, funcionalidade);
    }

    @Override
    public void run() {
        String argumentos;
        String header = null;
        String linha;
        String[] partesLinha;

        try (BufferedReader reader =
                new BufferedReader(new InputStreamReader(this.sessao.getSocket().getInputStream()))) {
            while (true) {
                linha = reader.readLine();
                partesLinha = linha.split(SEPARADOR_MENSAGEM);
                header = partesLinha[0];
                argumentos = Arrays.stream(partesLinha).skip(0).collect(Collectors.joining());

                Method funcionalidade = this.funcionalidadesRegistradas.get(header);

                if (funcionalidade == null) {
                    continue;
                }

                funcionalidade.invoke(null, argumentos);

                if (Objects.equals(linha, ENCERRAR_ROUTER)) {
                    return;
                }
            }
        } catch (IOException e) {
            logger.warning(e.getMessage());
        } catch (InvocationTargetException e) {
            logger.severe(e.getMessage());
        } catch (IllegalAccessException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.access.denied.method")
                    .formatted(funcionalidadesRegistradas.get(header).getName(), e.getMessage()));
        }
    }
}
