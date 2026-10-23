<h1 style="text-align: center" align="center">
    <a href="/" align="center" style="text-align: center">
        <img src="img/logo.svg" style="width: 20rem" alt="logo do projeto"><br/>
        Heber Modelo
    </a>
</h1>

Projeto baseado no [brModelo](https://github.com/chcandido/brModelo), visando criar uma ferramenta mais moderna, com correção de algumas falhas,
com uma melhor experiência do usuário e uma maior customização. Desenvolvido por estudantes do Curso Técnico em
Informática do Instituto Federal do Paraná - Campus Curitiba, como projeto de conclusão de curso, com um escopo
inicial reduzido por causa disso. Após o término do período de entrega, planejamos repensar as funcionalidades
propostas e abrir para contribuições externas.

## Rodando o Programa

Para rodar o programa baixe o JAR da última versão presente na página _releases_ no repositório do projeto no GitHub,
e o execute com o seguinte comando:

```shell
java -jar heber-modelo
```

## Configurações

#### Diretório de configurações:

**Windows:** %APPDATA%\\heber-modelo\\

**Mac:** $HOME/Library/Application Support/heber-modelo/

**Unix:** $HOME/.config/heber-modelo/

O programa disponibiliza algumas opções de configuração, que são feitas
usando [TOML(Tom's Obvious Minimal Language)](https://toml.io/en/). Os arquivos são criados automaticamente pelo
programa, caso não existam.

### Arquivos de configurações:

* config.toml
* paleta.toml

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

- [Gradle](https://gradle.org/) 9.8.1
- [Java](https://www.oracle.com/java/technologies/downloads/) 25
- [PNPM](https://pnpm.io/pt/) ^12.14.0
- [NodeJS](https://nodejs.org/pt) 25.2.1

Para compilação da documentação:

- [UV](https://docs.astral.sh/uv/) ^0.10.7
- [Python](https://www.python.org/) 3.13

Para auxiliar na execução do passo a passo:

- [Just](https://just.systems/man/en/) ^1.58.0

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

### Passo a Passo utilizando o Just

```shell
git clone https://github.com/Heber-Modelo/heber-modelo
cd heber-modelo

just setup
just compile-sources

./gradlew bootRun # Ou
./gradlew bootJar
```
