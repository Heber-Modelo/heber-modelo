<h1 style="text-align: center" align="center">
    <img src="logo.svg" style="width: 20rem" alt="logo do projeto"><br/>
    Heber Modelo
</h1>

![GitHub Latest release](https://img.shields.io/github/v/release/HeberBarra/heber-modelo?logo=github&label=Release)
![Project license](https://img.shields.io/github/license/HeberBarra/heber-modelo?logo=github&label=License)
![Project Top Language](https://img.shields.io/github/languages/top/HeberBarra/heber-modelo?logo=openjdk&label=Java)

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Sass](https://img.shields.io/badge/Scss-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?style=for-the-badge&logo=TypeScript&logoColor=white)

![Java](https://img.shields.io/badge/Java-ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-6DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

<b>PROPOSTA:</b> Ferramenta para criação de diagramas UML, com funcionalidades extras para o ambiente educacional.

Projeto baseado no [brModelo](https://github.com/chcandido/brModelo), visando criar uma ferramenta mais moderna,
corrigindo algumas falhas, melhorando a experiência do usuário e permitindo maior customização.
Desenvolvido por estudantes do Curso Técnico em Informática do Instituto Federal do Paraná - Campus Curitiba, como
projeto de conclusão de curso.

# Arquitetura

O projeto utiliza a framework [Spring Boot](https://spring.io/projects/spring-boot) seguindo o _design pattern_ MVC,
utilizando o MySQL como sistema de banco de dados(BD). É disponibilizado junto do programa os arquivos de criação e
configuração da base dados utilizada pelo programa, assim como um Dockerfile e um docker-compose.yml configurado
para rodar este BD.

# Plugins

Os plugins por enquanto são somente uma funcionalidade que está em fase de planejamento.

Porém, uma API do programa para permitir essa funcionalidade já se encontra disponível em:

&lt; https://github.com/HeberBarra/heber-modelo-api &gt;

# Ajuda Básica

Utilizando a flag --help o programa exibe todos as flags disponíveis e o seu respectivo propósito.

Caso algum erro ocorra e o programa não funcione como esperado é recomendado ler as mensagens de log do programa
para descobrir a causa do problema.

# Configurações

#### Diretório de configurações:

**Windows:** %APPDATA%\\heber-modelo\\

**Mac:** $HOME/Library/Application Support/heber-modelo/

**Unix:** $HOME/.config/heber-modelo/

O programa disponibiliza algumas opções de configuração, que são feitas
usando [TOML(Tom's Obvious Minimal Language)](https://toml.io/en/). Os arquivos são criados automaticamente pelo
programa caso não existam.

### Arquivos de configurações:

* Configuracoes.toml
* Paleta.toml

# Instalação

O programa é disponibilizado como um arquivo jar, sendo possível baixar o programa através da aba releases do GitHub, ou
clonando o repositório e compilando o programa usando gradle bootJar.

Para rodar o programa, basta dar dois cliques dependendo da configuração do sistema, ou utilizar o seguinte comando
num terminal(na mesma pasta na qual o programa foi posto):

```java -jar heber-modelo.jar```

*É necessário utilizar a versão 24 do Java.

# Funcionalidades Planejadas/Propostas

- [ ] Seletor Radial
- [ ] Formatação automática
- [x] Suporte para temas
- [ ] Suporte para plugins
- [ ] Suporte para keymaps customizados
- [ ] Formatação automática de atributos
- [ ] Estilos diferentes de fundo/grade
- [ ] Exportação para PDF, SVG, PNG e XML
- [ ] Alinhar elementos com a grade
- [x] Auto atualização*

\*Devido à mudança de nome do programa, versões anteriores a v0.0.5 não conseguem atualizar.

# Autores

<a href="https://github.com/HeberBarra/heber-modelo/graphs/contributors">
    <img src="https://contributors-img.web.app/image?repo=HeberBarra/heber-modelo&max=500" alt="Lista de contribuidores" width="20%">
</a>
