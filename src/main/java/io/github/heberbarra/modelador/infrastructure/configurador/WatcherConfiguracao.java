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

package io.github.heberbarra.modelador.infrastructure.configurador;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.configurador.ILeitorConfiguracao;
import io.github.heberbarra.modelador.domain.configurador.IVerificadorConfiguracao;
import io.github.heberbarra.modelador.domain.configurador.IWatcherConfiguracao;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.logging.Logger;
import org.tomlj.TomlTable;

public class WatcherConfiguracao implements IWatcherConfiguracao {

    private static final Logger logger = JavaLogger.obterLogger(WatcherConfiguracao.class.getName());
    private static final int DELAY_RELOAD = 500;
    private final CriadorConfiguracoes criadorConfiguracoes;
    private final IConfigurador configurador;
    private final ILeitorConfiguracao leitorConfiguracao;
    private final IVerificadorConfiguracao verificadorConfiguracaoPrograma;
    private final Path pastaConfiguracao;

    public WatcherConfiguracao() {
        configurador = ConfiguradorFactory.build();
        criadorConfiguracoes = (CriadorConfiguracoes) configurador.getCriadorConfiguracoes();
        leitorConfiguracao = configurador.getLeitorConfiguracao();
        pastaConfiguracao = Path.of(configurador.getPastaConfiguracao().decidirPastaConfiguracao());
        verificadorConfiguracaoPrograma = configurador.getVerificadorConfiguracao();
    }

    public void recarregarConfiguracao() {
        TomlTable configuracoes = leitorConfiguracao.lerArquivoConfiguracoesSemSalvar();
        TomlTable paleta = leitorConfiguracao.lerArquivoPaletaSemSalvar();

        verificadorConfiguracaoPrograma.verificarArquivoConfiguracao(
                criadorConfiguracoes.getConfiguracaoPadrao(), configuracoes);
        verificadorConfiguracaoPrograma.verificarArquivoPaleta(criadorConfiguracoes.getPaletaPadrao(), paleta);

        if (verificadorConfiguracaoPrograma.configuracoesContemErrosGraves()) {
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.config.reload"));
        } else {
            configurador.lerConfiguracao();
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("config.reloaded"));
        }
    }

    @SuppressWarnings("CatchMayIgnoreException")
    @Override
    public void run() {
        WatchService watcher;
        WatchKey watchKey;
        try {
            watcher = FileSystems.getDefault().newWatchService();
            pastaConfiguracao.register(watcher, StandardWatchEventKinds.ENTRY_MODIFY);
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.config.create.watcher")
                    .formatted(e.getMessage()));
            return;
        }

        boolean isKeyValid;
        do {
            try {
                watchKey = watcher.take();
            } catch (InterruptedException e) {
                return;
            }

            for (WatchEvent<?> event : watchKey.pollEvents()) {
                WatchEvent.Kind<?> kind = event.kind();

                if (kind != StandardWatchEventKinds.ENTRY_MODIFY) {
                    return;
                }

                logger.info(TradutorWrapper.tradutor.traduzirMensagem("config.changed"));

                try {
                    Thread.sleep(DELAY_RELOAD);
                } catch (InterruptedException e) {
                }

                recarregarConfiguracao();
            }
            isKeyValid = watchKey.reset();
        } while (isKeyValid);
    }
}
