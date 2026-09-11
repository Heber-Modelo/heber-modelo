/*
 * Copyright (C) 2025 Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.application.usecase.ejetar;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import io.github.heberbarra.modelador.infrastructure.configurador.PastaConfiguracao;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Faz uma cópia de certos arquivos que estão dentro do JAR e joga eles para fora, permitindo assim que o usuário
 * possa utilizá-los mais facilmente.
 * <p>
 * Considere "ejetar" nesse contexto, como fazer uma cópia de um arquivo.
 *
 * @since v0.0.4-SNAPSHOT
 */
public class EjetorArquivosBanco {

    private static final Logger logger = JavaLogger.obterLogger(EjetorArquivosBanco.class.getName());
    public static final String PASTA_ARQUIVOS_BANCO = "database/";
    public static final String PASTA_SCRIPTS = PASTA_ARQUIVOS_BANCO + "init/";
    public static final String CONFIGURAR_BANCO = PASTA_SCRIPTS + "01 - ConfigurarBancoDados.sql";
    public static final String CONFIGURAR_USERS = PASTA_SCRIPTS + "02 - CriarUsuarios.sh";
    public static final String ARQUIVO_DOCKER_COMPOSE = PASTA_ARQUIVOS_BANCO + "docker-compose.yml";
    public static final String ARQUIVO_DOCKER = PASTA_ARQUIVOS_BANCO + "Dockerfile";
    private final AcessadorRecursos acessadorRecursos;
    private final IConfigurador configurador;
    private final String destinoArquivos;

    public EjetorArquivosBanco() {
        this.acessadorRecursos = new AcessadorRecursos();
        this.configurador = ConfiguradorFactory.build();
        this.destinoArquivos = configurador
                .pegarValorConfiguracao("ejetor", "destino", String.class)
                .orElseThrow();
    }

    /**
     * Ejeta os arquivos utilizados para configurar a base de dados
     */
    public void ejetarScriptsConfiguracao() {
        String pastaDestino = destinoArquivos + "init/";
        ejetarArquivo(pastaDestino, CONFIGURAR_BANCO);
        ejetarArquivo(pastaDestino, CONFIGURAR_USERS);
    }

    /**
     * Ejeta o arquivo utilizado para criar o docker compose do programa, opcionalmente, caso o usuário deseje
     * (decido pela configuração do programa), cria uma cópia do arquivo env para o mesmo local para onde será
     * ejetado o arquivo docker compose
     */
    public void ejetarDockerCompose() {
        ejetarArquivo(destinoArquivos, ARQUIVO_DOCKER_COMPOSE);
        ejetarArquivo(destinoArquivos, ARQUIVO_DOCKER);

        Optional<Boolean> copiarArquivoEnv =
                configurador.pegarValorConfiguracao("ejetor", "copiar_arquivo_env", boolean.class);
        if (copiarArquivoEnv.isPresent() && copiarArquivoEnv.get()) {
            copiarArquivoDotEnv();
        }
    }

    /**
     * Ejeta um arquivo específico de dentro do JAR, para o destino desejado, copiando o conteúdo do arquivo original
     * para o gerado
     * <p>
     * Cria a pasta de destino e suas antecessoras, caso as mesmas não existam
     *
     * @param pastaDestino a pasta na qual o arquivo deve ser salvo
     * @param arquivo      o arquivo a ser ejetado pelo programa
     */
    private void ejetarArquivo(String pastaDestino, String arquivo) {
        try (InputStream arquivoExtraido = acessadorRecursos.pegarRecurso(arquivo)) {
            String nomeArquivo = Arrays.stream(arquivo.split("/")).toList().getLast();
            File arquivoDestino = new File(pastaDestino + nomeArquivo);
            if (arquivoDestino.getParentFile().mkdirs())
                logger.info(TradutorWrapper.tradutor.traduzirMensagem("file.dirs.creation.success"));

            if (arquivoDestino.createNewFile())
                logger.info(TradutorWrapper.tradutor
                        .traduzirMensagem("file.creation.success")
                        .formatted(arquivoDestino));

            Files.copy(arquivoExtraido, arquivoDestino.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create")
                    .formatted(arquivo, e.getMessage()));
        }
    }

    /**
     * Cria um link simbólico para o arquivo env especificado nas configurações do programa, permitindo assim passar
     * segredos para os arquivos ejetados mais facilmente.
     */
    @SuppressWarnings("ResultOfMethodCallIgnored")
    private void copiarArquivoDotEnv() {
        PastaConfiguracao pastaPrograma = new PastaConfiguracao();
        String nomeEnv = configurador
                .pegarValorConfiguracao("ejetor", "nome_arquivo_env", String.class)
                .orElseThrow();
        Path arquivoEnv = new File("%s/%s".formatted(pastaPrograma.getPasta(), nomeEnv))
                .getAbsoluteFile()
                .toPath();
        File arquivoLink = new File(destinoArquivos, "/.env");
        Path caminhoLink = arquivoLink.toPath();

        try {
            if (arquivoLink.exists()) {
                arquivoLink.delete();
            }

            Files.createSymbolicLink(caminhoLink, arquivoEnv);
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create.link")
                    .formatted(arquivoLink));
        }
    }
}
