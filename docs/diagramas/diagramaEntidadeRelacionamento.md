# DIAGRAMA DE ENTIDADE-RELACIONAMENTO

O Diagrama de Entidade-Relacionamento é a representação mais conceitual e básica dos dados, mostrando como
os dados numa forma semelhante ao que o usuário "vê" quando usa uma aplicação. É o primeiro diagrama feito numa
modelação completa de uma base de dados.

## Elementos

### Entidade

Representa uma tabela da base de dados, com os seus atributos e relacionamentos com outras tabelas.

#### Entidade Fraca

Representada por uma linha mais grossa e pela ausência de uma chave primária entre os seus atributos.

### Relacionamento

Representa uma associação entre duas ou mais entidades, ou de uma entidade consiga mesma no caso de um relacionamento
recursivo. Atributos podem ser adicionados a um relacionamento para representar informações que não pertencem a nenhuma
das entidades conectadas, mas que são pertinentes àquela conexão, como a data de compra de um produto, num relacionamento
entre cliente e produto.

### Agregação (Pouco Usado)

Mesmo sendo raramente utilizado, foi inclusa no programa para abranger um número, ainda que ligeiramente,
maior de usuários.

Utilizado para representar a conexão entre dois ou mais relacionamentos. Também conhecido como entidade associativa.

### Cardinalidade

Representa as restrições de número das conexões entre as entidades, com quantos objetos um objeto daquela entidade
pode se relacionar. Por exemplo, um diretor trabalha apenas em uma escola, mas escola pode ter mais de um diretor,
seccionados por setor, como educação técnica, e ensino regular. Nisso, se constituiria um relacionamento 1:N.

### Atributo

Representa um campo de uma entidade na base de dados, a chave primária é demarcada por um círculo preenchido em oposição
ao círculo vazado, padrão dos atributos. Para preencher o círculo clique com o botão esquerdo do _mouse_ sobre ele. É possível,
inverter a posição do nome e do círculo do atributo apertando com o _scroll_ do _mouse_ sobre ele.

### Especialização

Representa a herança de atributos e de relacionamentos entre uma entidade e outra(s). Numa relação de pai-filho.
A entidade filho, tem além de seus próprios atributos e relacionamentos, todas as características da entidade pai.

O mesmo símbolo pode ser para o processo reverso chamado generalização, onde várias entidades filhas são unificadas por
meio de uma entidade pai.

### Texto

Elemento adicional para permitir a inserção de textos avulsos no diagrama.

### Nota

Elemento puramente decorativo, servindo para dar pequenas explicações e comentários sobre o diagrama.

**Referência**:

ANGELLOTI, Elaini Simoni. Banco de Dados. Curitiba: Editora do Livro Técnico, 2010.
