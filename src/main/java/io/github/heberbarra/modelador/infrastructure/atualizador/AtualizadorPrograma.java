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

package io.github.heberbarra.modelador.infrastructure.atualizador;

import io.github.heberbarra.modelador.Principal;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.application.usecase.hash.CalculadorHash;
import io.github.heberbarra.modelador.application.usecase.pegar.PegadorVersaoRemota;
import io.github.heberbarra.modelador.domain.atualizador.IAtualizador;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.logging.Logger;

public class AtualizadorPrograma implements IAtualizador {

    public static final URL URL_ARQUIVO_JAR;
    public static final URL URL_ARQUIVO_SHA256;
    private static final Logger logger = JavaLogger.obterLogger(AtualizadorPrograma.class.getName());
    private final IConfigurador configurador;
    private final ComparadorVersao comparadorVersao;

    static {
        try {
            URI arquivoJar = new URI("https://github.com/HeberBarra/%s/releases/latest/download/%s.jar"
                    .formatted(Principal.NOME_PROGRAMA.toLowerCase(), Principal.NOME_PROGRAMA.toLowerCase()));
            URI arquivoSha256 = new URI("https://github.com/HeberBarra/%s/releases/latest/download/SHA256SUM"
                    .formatted(Principal.NOME_PROGRAMA.toLowerCase()));
            URL_ARQUIVO_JAR = arquivoJar.toURL();
            URL_ARQUIVO_SHA256 = arquivoSha256.toURL();
        } catch (MalformedURLException | URISyntaxException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.urls.create")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_URLS.getCodigo());
            throw new RuntimeException();
        }
    }

    public AtualizadorPrograma() {
        configurador = ConfiguradorFactory.build();
        PegadorVersaoRemota pegadorVersaoRemota = new PegadorVersaoRemota();
        String versaoPrograma = AtualizadorPrograma.class.getPackage().getImplementationVersion();
        String versaoRemota = pegadorVersaoRemota.pegarVersaoRemota();

        if (versaoRemota.isEmpty()) {
            versaoRemota = versaoPrograma;
        }

        comparadorVersao = new ComparadorVersao(versaoPrograma, versaoRemota);
    }

    /**
     * Verifica se há alguma atualização disponível.
     *
     * @return {@code true} caso haja uma atualização disponível.
     */
    @Override
    public boolean verificarAtualizacaoDisponivel() {
        return comparadorVersao.compararVersoes() == ComparadorVersao.MAIOR;
    }

    /**
     * Atualiza automaticamente o programa caso as atualizações automáticas estejam habilitadas na configuração do programa.
     */
    public void atualizar() {
        if (!verificarAtualizacaoDisponivel()) {
            return;
        }

        logger.info(TradutorWrapper.tradutor.traduzirMensagem("update.new"));
        Optional<Boolean> atualizacaoAutomatica =
                configurador.pegarValorConfiguracao("atualizador", "atualizacao_automatica", boolean.class);
        if (atualizacaoAutomatica.isPresent() && atualizacaoAutomatica.get()) {
            baixarAtualizacao();
            return;
        }

        logger.info(TradutorWrapper.tradutor.traduzirMensagem("update.auto.off"));
    }

    /**
     * Baixa a última versão do programa, e substitui o programa atual pelo mais recente.
     * <p>
     * Verifica a integridade dos arquivos, se houver algum erro de integridade, ou não seja possível ler o arquivo de verificação, a atualização é cancelada.
     * <p>
     * Limpa os arquivos temporários gerados após atualizar o programa.
     */
    public void baixarAtualizacao() {
        File pastaTemporaria = new File("./tmp");
        if (pastaTemporaria.mkdir()) {
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("file.dir.temp.downloads.success"));
        }

        baixarArquivo(pastaTemporaria, URL_ARQUIVO_JAR, "heber-modelo.jar");
        baixarArquivo(pastaTemporaria, URL_ARQUIVO_SHA256, "SHA256SUM");

        String hashArquivoJar = "";
        try {
            byte[] dados = Files.readAllBytes(new File("./tmp/heber-modelo.jar").toPath());
            CalculadorHash calculadorHash = new CalculadorHash();
            hashArquivoJar = calculadorHash.calcularHash256(dados);
        } catch (IOException e) {
            logger.severe(e.getMessage());
        }

        String hashChecksum;
        try (BufferedReader bufferedReader = new BufferedReader(new FileReader("./tmp/SHA256SUM"))) {
            String linha;
            while ((linha = bufferedReader.readLine()) != null) {
                if (linha.contains("heber-modelo.jar")) {
                    break;
                }
            }

            if (linha == null) {
                logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.verify"));
                logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.cancel"));
                return;
            }

            hashChecksum = linha.split(" ")[0];
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.verify.read")
                    .formatted(e.getMessage()));
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.cancel"));
            return;
        }

        if (!hashChecksum.equals(hashArquivoJar)) {
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.verify.match"));
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.cancel"));
            return;
        }

        try {
            Files.move(
                    Path.of("./tmp/heber-modelo.jar"),
                    Path.of("./heber-modelo.jar"),
                    StandardCopyOption.REPLACE_EXISTING);
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("update.success"));
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("update.restart.required"));
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.move.file")
                    .formatted(e.getMessage()));
        }

        limparArquivosTemporarios(pastaTemporaria);
    }

    @Override
    public void limparArquivosTemporarios(File pastaTemporaria) {
        File[] arquivos = pastaTemporaria.listFiles();

        if (arquivos == null) {
            if (pastaTemporaria.delete()) {
                logger.info(TradutorWrapper.tradutor
                        .traduzirMensagem("file.dir.delete.success")
                        .formatted(pastaTemporaria.getName()));
            }
            return;
        }

        for (File arquivo : arquivos) {
            if (arquivo.isDirectory()) {
                limparArquivosTemporarios(arquivo);
                continue;
            }

            if (arquivo.delete()) {
                logger.info(TradutorWrapper.tradutor
                        .traduzirMensagem("file.delete.success")
                        .formatted(arquivo.getName()));
            }
        }

        if (pastaTemporaria.delete()) {
            logger.info(TradutorWrapper.tradutor
                    .traduzirMensagem("file.dir.delete.success")
                    .formatted(pastaTemporaria.getName()));
        }
    }

    @Override
    public void baixarArquivo(File pastaTemporaria, URL urlArquivo, String nomeArquivo) {
        try (FileOutputStream fileOutputStream = new FileOutputStream(pastaTemporaria.getPath() + "/" + nomeArquivo)) {
            ReadableByteChannel byteChannel = Channels.newChannel(urlArquivo.openStream());
            FileChannel fileChannel = fileOutputStream.getChannel();
            fileChannel.transferFrom(byteChannel, 0, Long.MAX_VALUE);
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.download.file")
                    .formatted(urlArquivo.getPath(), e.getMessage()));
        }
    }
}
