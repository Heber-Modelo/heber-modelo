# CONFIGURAÇÃO

O programa pode ser configurado a partir de dois arquivos [TOML](https://toml.io/pt/v1.0.0), um para a paleta de cores
e o outro servindo para ajustar as funcionalidades do programa. A pasta na qual esses arquivos serão criados é definida
com base em umas das seguintes variáveis de ambiente: XDG_CONFIG_DIR, HEBER_MODELO_CONFIG_DIR. Caso, elas não estejam
definidas, a pasta de configuração será escolhida conforme o sistema operacional:

- GNU/Linux: $HOME/.config/Heber-Modelo
- MacOS: $HOME/Library/Preferences/Heber-Modelo
- Windows: %AppData/Heber-Modelo
- Outros sistemas: $HOME/.config/Heber-Modelo

Quando são introduzidas novas opções de configuração no programa elas são automaticamente inseridas nos arquivos
de configuração, sem modificar as opções alteradas feitas pelo usuário.

## OPÇÕES DE CONFIGURAÇÃO

Estas são as opções que podem ser modificados no arquivo config.toml.
Cada valor permitido para uma opção pode ser um dos seguintes tipos de dados: string, boolean, integer ou number.

### Atualizador

Opções relacionados ao componente de autoatualização do programa.

```
[atualizador]
  atualizacao_automatica=true
```

#### Atualização Automática (Boolean)

Controla se o programa será atualizado automaticamente quando for iniciado. Se a atualização automática estiver desligada,
o programa somente avisará que há uma atualização disponível.

### Bindings

```
[bindings]
  leaderKey="Control"
  removerSelecao="Escape"
  reverterUltimaAcao="z"
  moverElementoParaCima="ArrowUp"
  moverElementoParaBaixo="ArrowDown"
  moverElementoParaDireita="ArrowRight"
  moverElementoParaEsquerda="ArrowLeft"
  copiarElemento="c"
  cortarElemento="x"
  colarElemento="v"
  apagarElemento="Delete"
```

As `keymaps` do programa, sendo cada uma associada a uma função da página de edição de diagramas.

### Editor
```
[editor]
  incrementoMovimentacaoElemento=10
```

#### Incremento Movimentação Elemento (Integer)

Define a quantidade de pixeis que um elemento se moverá quando o usuário o movimentar usando o teclado.

### Ejetor

```
[ejetor]
  destino="db/"
  copiar_arquivo_env=true
  nome_arquivo_env=".env"
```

As opções relacionados ao ejetor de arquivos do programa, que serve para extrair as configurações do banco de dados
MySQL e do Docker Compose.

#### Destino (String)

Define a pasta na qual os arquivos serão colocados após a extração.

#### Copiar Arquivo ENV (Boolean)

Define se o arquivo env do programa deve ser copiado e colocado na pasta destino da extração. Visando facilitar
a execução do `docker compose`, pois o mesmo consegue puxar as variáveis de sistema presente no arquivo env.

#### Nome Arquivo ENV (String)

Complementar à opção anterior, define o nome do arquivo env que deve ser copiado.

### Grade

```
[grade]
  exibir=true
  espessura=1
  tamanho_quadrado_px=50
```

Configura a grade de fundo que aparece na tela edição de diagramas.

#### Exibir (Boolean)

Define se a grade deve ser exibida.

#### Espessura (Integer)

Define a espessura das linhas da grade, tanto horizontais quanto verticais.

#### Tamanho Quadrado PX (Integer)

Define em píxeis o tamanho de cada quadrado que compõe a grade de fundo.

### MySQL

```
[mysql]
  porta=3306
  modoProfessor=false
  host="localhost"
```

Estas são as opções relacionadas a conexão com o banco de dados MySQL, as funcionalidades que interagem
o banco ainda não estão implementadas, por isso essas opções ainda não são revelantes.

#### Host (String)

Define o `hostname` que será utilizado para efetuar a conexão com o banco de dados.

#### Porta (Integer)

Define a `port`(porta) que será utilizada para efetuar a conexão com o banco de dados.

#### Modo Professor (Boolean)

Ainda não implementado, mas servirá para ativar o modo específico para o professor mediante autenticação.

### Programa

```
[programa]
  porta=8080
  dominio="localhost"
  abrir_navegador_automaticamente=true
  desativar_botao_desligar=false
```
