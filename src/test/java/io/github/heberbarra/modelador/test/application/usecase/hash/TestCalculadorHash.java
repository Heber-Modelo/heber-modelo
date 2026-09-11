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

package io.github.heberbarra.modelador.test.application.usecase.hash;

import io.github.heberbarra.modelador.application.usecase.hash.CalculadorHash;
import org.junit.jupiter.api.Test;

public class TestCalculadorHash {

    @Test
    protected void TestHash256() {
        CalculadorHash calculadorHash = new CalculadorHash();

        EntradaCalculador primeiraEntrada =
                new EntradaCalculador("Deus Pai", "b86db0021291b0c550f0e36bd984fbeec61d415bef506646ccf265f2415ed18d");

        EntradaCalculador segundaEntrada = new EntradaCalculador(
                "Jesus Cristo", "257acf5c3065075039c248dac69704f57cb3acfe181af5b1c5864edad93072f5");

        EntradaCalculador terceiraEntrada = new EntradaCalculador(
                "Espírito Santo", "3c9ca777dfa3e985e87fc75322ed5134f8907aeee525f47b9058616a1c8b035f");

        assert calculadorHash.calcularHash256(primeiraEntrada.getEntradaBytes()).equals(primeiraEntrada.saida());
        assert calculadorHash.calcularHash256(segundaEntrada.getEntradaBytes()).equals(segundaEntrada.saida());
        assert calculadorHash.calcularHash256(terceiraEntrada.getEntradaBytes()).equals(terceiraEntrada.saida());

        // Verificação para ver se os resultados do Hash são diferentes
        assert !(calculadorHash
                .calcularHash256(primeiraEntrada.getEntradaBytes())
                .equals(segundaEntrada.saida()));
    }

    @Test
    protected void TestHash512() {
        CalculadorHash calculadorHash = new CalculadorHash();

        EntradaCalculador primeiraEntrada = new EntradaCalculador(
                "Paulo de Tarso",
                "b70c63892e2af16dbe6493f5f51a4d1d79394398f433cb4e599b00028b15d2f20171fc3b1ba266e954fe8e99bf17c3b4ef072f8d5548db0cee599e1399b92ed7");

        EntradaCalculador segundaEntrada = new EntradaCalculador(
                "Pedro Barjonas",
                "1224faa0af573e81589ae950f3d6575136731b8fffd492a93a5fe5930f41d19aff9446924b0b090290301d453e221900f048a980f97e89dd0cbdb9f5a8db598a");

        EntradaCalculador terceiraEntrada = new EntradaCalculador(
                "Tiago Maior",
                "d7e17f851682bb0acedfda4f69505c7c0ded5666cd21768662fa760fcf60c1dce6720832db8e221f472c90d31e952ba08ddaf6cbf6491224df9558fefb2fafee");

        assert calculadorHash.calcularHash512(primeiraEntrada.getEntradaBytes()).equals(primeiraEntrada.saida());
        assert calculadorHash.calcularHash512(segundaEntrada.getEntradaBytes()).equals(segundaEntrada.saida());
        assert calculadorHash.calcularHash512(terceiraEntrada.getEntradaBytes()).equals(terceiraEntrada.saida());

        // Verificação para ver se os resultados do hash são diferentes
        assert !(calculadorHash
                .calcularHash512(primeiraEntrada.getEntradaBytes())
                .equals(segundaEntrada.saida()));
    }
}
