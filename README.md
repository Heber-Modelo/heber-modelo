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

&lt;[https://github.com/HeberBarra/heber-modelo-api](https://github.com/HeberBarra/heber-modelo-api)&gt;

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
programa, caso não existam.

### Arquivos de configurações:

* Configuracoes.toml
* Paleta.toml

# Instalação

O programa é disponibilizado como um arquivo jar, sendo possível baixar o programa através da aba releases do GitHub, ou
clonando o repositório e compilando o programa usando gradle bootJar.

Para rodar o programa, basta dar dois cliques dependendo da configuração do sistema, ou utilizar o seguinte comando
num terminal(na mesma pasta na qual o programa foi posto):[^1]

```shell
java -jar heber-modelo.jar
```

[^1]: É necessário utilizar a [versão 25 do Java](https://www.oracle.com/java/technologies/downloads/).

## Configuração do Banco de Dados

### Autenticação

As credenciais do Banco de Dados são definidas no arquivo ".env" localizado na pasta de configuração do programa. Sendo,
portanto, necessário rodar o programa pelo menos uma vez ou utilizar a flag "--gen-config". As credenciais são utilizadas
para acessar o Banco de Dados, e, se for o caso, para configurar os usuários do Banco de Dados, logo, é imprescindível
editar o arquivo ".env" antes de criar o Banco de Dados.

### Método Utilizando Docker

O método recomendado para configurar o banco de dados aplicação é por meio do [Docker](https://docker.com),
a fim de criar um ambiente isolado e seguro para os dados, para tal ejete tanto os arquivos SQL do banco
quanto os arquivos próprios do docker:

```shell
java -jar heber-modelo.jar --eject-database-scripts
java -jar heber-modelo.jar --eject-docker-compose
```

Na configuração padrão os arquivos serão gerados numa pasta "db" no mesmo local onde o comando foi executado,
é possível alterar o nome dessa pasta nas configurações do programa.

Dentro da pasta gerada, basta executar o seguinte comando para iniciar e configurar o Banco de Dados:

```shell
docker compose up -d
```

### Método Alternativo

Caso não seja desejado, ou possível, utilizar Docker, é possível gerar um arquivo SQL para configurar os usuários,
em conjunto com o SQL gerado pelo "--eject-database-scripts". Nesse caso, apenas esses dois comandos são necessários:

```shell
java -jar heber-modelo.jar --eject-database-scripts
java -jar heber-modelo.jar --generate-sql-users
```

Assim como a pasta "db", o arquivo de configuração de usuários será gerado no local no qual o comando foi executado.

Modifique o arquivo "criarUsuarios.sql" para definir as credenciais de acesso ao banco, podendo ser utilizado
qualquer editor de texto simples, como o Bloco de Notas.

Agora, basta executar primeiro o arquivo "01 - ConfigurarBancoDados.sql" e em seguida o arquivo "criarUsuarios.sql",
valendo-se, por exemplo, do [MySQL Workbench](https://www.mysql.com/products/workbench/), a ferramenta oficial para
se ter uma interface visual de acesso ao MySQL, para rodar os comandos contidos nos arquivos.

## Compilação Manual

### Dependências:

- [Gradle](https://gradle.org/) 9.7.0
- [Java](https://www.oracle.com/java/technologies/downloads/) 25
- [PNPM](https://pnpm.io/pt/) ^10.33.0
- [NodeJS](https://nodejs.org/pt) 25.2.1

Para compilação da documentação:

- [UV](https://docs.astral.sh/uv/) ^0.10.7
- [Python](https://www.python.org/) 3.13

Para auxiliar na execução do passo a passo:

- [Just](https://just.systems/man/en/) ^1.50.0

### Passo a passo

```shell
git clone https://github.com/Heber-Modelo/heber-modelo
cd heber-modelo

pnpm install
pnpm run compile-scss
pnpm run compile-ts


# Opcional, a fim de gerar a documentação integrada ao programa
uv sync
uv run mkdocs build --clean --no-directory-urls --site-dir ./src/main/resources/static/docs

./gradlew bootRun # Para rodar o programa diretamente, ou
./gradlew bootJar # para gerar um jar executável do programa em ./build/libs
```

# Funcionalidades Planejadas/Propostas

- [ ] Seletor Radial
- [ ] Formatação automática
- [x] Suporte para temas
- [ ] Suporte para plugins[^2]
- [x] Suporte para keymaps customizados
- [ ] Formatação automática de atributos
- [ ] Estilos diferentes de fundo/grade
- [x] Exportação para PDF, SVG, PNG e XHTML
- [ ] Alinhar elementos com a grade
- [x] Auto atualização[^3]

[^2]: A funcionalidade de plugins está em fase de planejamento, e não é prioritária no momento.

[^3]: Devido à mudança de nome do programa, versões anteriores a v0.0.5-SNAPSHOT não conseguem atualizar.

# Autores

<a href="https://github.com/HeberBarra/heber-modelo/graphs/contributors">
    <img src="https://contributors-img.web.app/image?repo=HeberBarra/heber-modelo&max=500" alt="Lista de contribuidores" width="20%">
</a>
