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

package io.github.heberbarra.modelador.infrastructure.data;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import io.github.heberbarra.modelador.infrastructure.security.UsuarioBanco;
import java.sql.SQLException;
import java.util.Objects;
import java.util.Optional;
import java.util.logging.Logger;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

@Service
public class DataSourceBuilder {
    private static final Logger logger = JavaLogger.obterLogger(DataSourceBuilder.class.toString());
    private static String tipoUsuario;

    @Bean
    public static DataSource dataSource() {
        AcessadorRecursos acessadorRecursos = new AcessadorRecursos();
        IConfigurador configurador = ConfiguradorFactory.build();
        configurador.lerConfiguracao();

        String host = acessadorRecursos.pegarValorVariavelAmbiente("MYSQL_HOST");
        String port = acessadorRecursos.pegarValorVariavelAmbiente("MYSQL_PORT");

        if (host == null || host.isBlank()) {
            host = configurador
                    .pegarValorConfiguracao("mysql", "host", String.class)
                    .orElseThrow();
        }

        if (port == null || port.isBlank()) {
            Long numeroPorta = configurador
                    .pegarValorConfiguracao("mysql", "porta", long.class)
                    .orElseThrow();
            port = String.valueOf(numeroPorta);
        }

        String username = UsuarioBanco.ESTUDANTE.getNomeUsuario();
        String password = acessadorRecursos.pegarValorVariavelAmbiente(UsuarioBanco.ESTUDANTE.getNomeVariavelSenha());
        tipoUsuario = "E";

        Optional<Boolean> modoProfessor = configurador.pegarValorConfiguracao("mysql", "modoProfessor", boolean.class);
        if (modoProfessor.isPresent() && modoProfessor.get()) {
            username = UsuarioBanco.PROFESSOR.getNomeUsuario();
            password = acessadorRecursos.pegarValorVariavelAmbiente(UsuarioBanco.PROFESSOR.getNomeVariavelSenha());
            tipoUsuario = "P";
        }

        DataSource dataSource;

        try {
            dataSource = org.springframework.boot.jdbc.DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url("jdbc:mysql://%s:%s/db_HeberModelo".formatted(host, port))
                    .username(username)
                    .password(password)
                    .build();
            dataSource.getConnection().close();
        } catch (SQLException e) {
            logger.severe(e.getMessage());
            String studentUsername = UsuarioBanco.ESTUDANTE.getNomeUsuario();
            String studentEnvironmentalVariable = UsuarioBanco.ESTUDANTE.getNomeVariavelSenha();
            String studentPassword = acessadorRecursos.pegarValorVariavelAmbiente(studentEnvironmentalVariable);
            tipoUsuario = "E";

            dataSource = org.springframework.boot.jdbc.DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url("jdbc:mysql://%s:%s/db_HeberModelo".formatted(host, port))
                    .username(studentUsername)
                    .password(studentPassword)
                    .build();
        }

        return dataSource;
    }

    public static String getTipoUsuario() {
        return tipoUsuario;
    }

    public static boolean isProfessor() {
        return Objects.equals(tipoUsuario, "P");
    }
}
