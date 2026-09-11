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
 * Ejeta o arquivo docker compose o arquivo Dockerfile
 *
 * @since v0.0.4-SNAPSHOT
 */
public class EjetorArquivosDocker extends Argumento {

    public EjetorArquivosDocker() {
        this.descricao = "Ejeta o arquivo docker-compose.yml e o arquivo Dockerfile de dentro do jar. "
                + "Obs.: caso não existam, os arquivos de configuração serão gerados";
        this.flagsPermitidas = List.of("--eject-docker-compose", "--ejetar-docker-compose");
    }

    /**
     * Ejeta o arquivo docker compose, mas primeiro gera os arquivos de configuração caso não existam,
     * pois é necessário saber para onde copiar o arquivo. Encerra o programa após ejetar o arquivo.
     */
    @Override
    public void run() {
        IConfigurador configurador = ConfiguradorFactory.build();
        configurador.criarArquivos();
        configurador.lerConfiguracao();
        EjetorArquivosBanco ejetorArquivosBanco = new EjetorArquivosBanco();
        ejetorArquivosBanco.ejetarDockerCompose();
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
