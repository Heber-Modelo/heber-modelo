/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.configurador.CriadorConfiguracoesBase;
import io.github.heberbarra.modelador.domain.configurador.ICombinadorConfiguracoes;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.configurador.ILeitorConfiguracao;
import io.github.heberbarra.modelador.domain.configurador.IPastaConfiguracao;
import io.github.heberbarra.modelador.domain.configurador.IVerificadorConfiguracao;
import io.github.heberbarra.modelador.infrastructure.conversor.IConversorTOMLString;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Gerencia as configurações do programa, e permite acesso fácil às mesmas.
 * <p>
 * Utiliza o anti pattern {@code Singleton} para garantir o compartilhamento das informações entre os utilizadores.
 *
 * @since v0.0.1-SNAPSHOT
 */
public final class Configurador implements IConfigurador {

    public static final String ARQUIVO_PALETA = "paleta.toml";
    public static final String ARQUIVO_CONFIGURACOES = "config.toml";
    private static final Logger logger = JavaLogger.obterLogger(Configurador.class.getName());
    private final CriadorConfiguracoesBase criadorConfiguracoes;
    private final ICombinadorConfiguracoes combinadorConfiguracoes;
    private final IConversorTOMLString conversorToml;
    private final ILeitorConfiguracao leitorConfiguracao;
    private final IPastaConfiguracao pastaConfiguracao;
    private final IVerificadorConfiguracao verificadorConfiguracao;

    public Configurador(
            CriadorConfiguracoesBase criadorConfiguracoes,
            ICombinadorConfiguracoes combinadorConfiguracoes,
            IConversorTOMLString conversorToml,
            IPastaConfiguracao pastaConfiguracao,
            ILeitorConfiguracao leitorConfiguracao,
            IVerificadorConfiguracao verificadorConfiguracao) {
        this.combinadorConfiguracoes = combinadorConfiguracoes;
        this.conversorToml = conversorToml;
        this.pastaConfiguracao = pastaConfiguracao;
        this.criadorConfiguracoes = criadorConfiguracoes;
        this.leitorConfiguracao = leitorConfiguracao;
        this.verificadorConfiguracao = verificadorConfiguracao;
    }

    @Override
    public void lerConfiguracaoPadrao() {
        verificadorConfiguracao.lerArquivosTemplate();
        if (verificadorConfiguracao instanceof VerificadorConfiguracao verificador) {
            criadorConfiguracoes.pegarConfiguracaoPadrao(
                    verificador.getLeitorConfiguracoes().getInformacoesJSON());
            criadorConfiguracoes.pegarDotEnvPadrao(verificador.getLeitorDotEnv().getInformacoesJSON());
            criadorConfiguracoes.pegarPaletaPadrao(verificador.getLeitorPaleta().getInformacoesJSON());
        }
    }

    /**
     * Cria a pasta e os arquivos de configuração se não existirem.
     *
     * @see CriadorConfiguracoes
     */
    @Override
    public void criarArquivos() {
        criadorConfiguracoes.criarPastaConfiguracao();
        lerConfiguracaoPadrao();
        criadorConfiguracoes.criarArquivoConfiguracoes(ARQUIVO_CONFIGURACOES);
        criadorConfiguracoes.criarArquivoDotEnv();
        criadorConfiguracoes.criarArquivoPaleta(ARQUIVO_PALETA);
    }

    /**
     * Lê as configurações do programa.
     *
     * @see LeitorConfiguracao
     */
    @Override
    public void lerConfiguracao() {
        leitorConfiguracao.lerArquivos();
    }

    /**
     * Verifica se há algum erro na configuração do programa, caso haja um erro o grave o programa é encerrado com o código de saída: {@link CodigoSaida#ERRO_CONFIGURACOES}.
     *
     * @see VerificadorConfiguracao
     */
    public void verificarConfiguracoes() {
        if (criadorConfiguracoes instanceof CriadorConfiguracoes criador) {
            verificadorConfiguracao.verificarArquivoConfiguracao(
                    criador.getConfiguracaoPadrao(), leitorConfiguracao.getInformacoesConfiguracoes());
            verificadorConfiguracao.verificarArquivoPaleta(
                    criador.getPaletaPadrao(), leitorConfiguracao.getInformacoesPaleta());
        }

        if (verificadorConfiguracao.configuracoesContemErrosGraves()) {
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("error.config.end.app"));
            System.exit(CodigoSaida.ERRO_CONFIGURACOES.getCodigo());
        }
    }

    /**
     * Mostra as configurações atuais do programa
     *
     * @see LeitorConfiguracao
     */
    @Override
    public void mostrarConfiguracao() {
        String[] informacoesConfiguracao = leitorConfiguracao.pegarStringConfiguracao();

        for (String informacao : informacoesConfiguracao) {
            System.out.println(informacao);
        }
    }

    /**
     * Atualiza as configurações do programa, mantendo os valores, com novas opções, se houverem, de configuração
     *
     * @see CombinadorConfiguracoes
     */
    @Override
    public void combinarConfiguracoes() {
        Map<String, List<Map<String, String>>> dadosConfiguracoes = new LinkedHashMap<>();
        Map<String, List<Map<String, String>>> dadosPaleta = new LinkedHashMap<>();

        if (criadorConfiguracoes instanceof CriadorConfiguracoes criador) {
            dadosConfiguracoes = combinadorConfiguracoes.combinarConfiguracoes(
                    criador.getConfiguracaoPadrao(),
                    leitorConfiguracao.getInformacoesConfiguracoes(),
                    "atributo",
                    "valorPadrao");
            dadosPaleta = combinadorConfiguracoes.combinarConfiguracoes(
                    criador.getPaletaPadrao(),
                    leitorConfiguracao.getInformacoesPaleta(),
                    "nomeVariavel",
                    "valorPadraoVariavel");
        }

        String dadosConfiguracoesToml = conversorToml.converterMapConfiguracaoParaStringTOML(dadosConfiguracoes);
        String dadosPaletaToml = conversorToml.converterMapPaletaParaStringTOML(dadosPaleta);

        criadorConfiguracoes.sobrescreverArquivoConfiguracoes(ARQUIVO_CONFIGURACOES, dadosConfiguracoesToml);
        criadorConfiguracoes.sobrescreverArquivoPaleta(ARQUIVO_PALETA, dadosPaletaToml);
        this.lerConfiguracao();
    }

    @Override
    public String pegarCorPaleta(String nomeVariavel) {
        return leitorConfiguracao.pegarCorPaleta(nomeVariavel);
    }

    @Override
    public Map<String, String> pegarInformacoesPaleta() {
        return leitorConfiguracao.pegarVariaveisPaleta();
    }

    @Override
    public <T> Optional<T> pegarValorConfiguracao(String categoria, String atributo, Class<T> tipo) {
        return leitorConfiguracao.pegarValorConfiguracao(categoria, atributo, tipo);
    }

    public CriadorConfiguracoesBase getCriadorConfiguracoes() {
        return null;
    }

    @Override
    public ICombinadorConfiguracoes getCombinarConfiguracoes() {
        return combinadorConfiguracoes;
    }

    public ILeitorConfiguracao getLeitorConfiguracao() {
        return leitorConfiguracao;
    }

    @Override
    public IPastaConfiguracao getPastaConfiguracao() {
        return pastaConfiguracao;
    }

    @Override
    public IVerificadorConfiguracao getVerificadorConfiguracao() {
        return verificadorConfiguracao;
    }
}
