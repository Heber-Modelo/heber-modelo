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

package io.github.heberbarra.modelador.domain.argumento;

import io.github.heberbarra.modelador.application.usecase.ejetar.EjetorArquivosBanco;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.util.List;

/**
 * Ejeta os arquivos de configuração da base de dados
 *
 * @since v0.0.4-SNAPSHOT
 */
public class EjetorArquivosBD extends Argumento {

    public EjetorArquivosBD() {
        this.descricao = "Ejeta os arquivos de criação e configuração do banco de dados de dentro do jar."
                + "Obs.: caso não existam, os arquivos de configuração serão gerados";
        this.flagsPermitidas = List.of("--eject-database-scripts", "--ejetar-arquivos-banco");
    }

    /**
     * Ejeta os arquivos de configuração da base de dados, mas primeiro gera os arquivos de configuração caso não
     * existam, pois é necessário saber o destino dos arquivos ejetados. Encerra o programa após ejetar os arquivos
     */
    @Override
    public void run() {
        IConfigurador configurador = ConfiguradorFactory.build();
        configurador.lerConfiguracao();
        EjetorArquivosBanco ejetorArquivosBanco = new EjetorArquivosBanco();
        ejetorArquivosBanco.ejetarScriptsConfiguracao();
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
