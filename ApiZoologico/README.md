# API de Gerenciamento de Zoológicos

Este projeto é uma API REST para gerenciamento de animais de um zoológico, desenvolvida com ASP.NET Core e .NET 10. É a continuação do meu projeto da AP1, substituindo o armazenamento em memória por um banco de dados SQLite utilizando Entity Framework Core.

A API também tem uma interface web integrada, permitindo listar, cadastrar, editar e excluir animais diretamente pelo navegador.

## Requisitos do projeto

- .NET SDK 10.0 ou superior.
- Entity Framework Core.
- SQLite.
- Bruno para testar as requisições HTTP.
- Navegador web para acessar a interface.

## Como executar o projeto

Na pasta do projeto, execute:

```bash
dotnet restore
dotnet build
```

Para preparar o banco de dados, aplique as migrations existentes:

```bash
dotnet ef database update
```

Caso o comando `dotnet ef` não esteja disponível, será necessário instalar a ferramenta `dotnet-ef`.

Depois, inicie a aplicação:

```bash
dotnet run --urls http://localhost:5050
```

A aplicação estará disponível em:

- Interface web: [http://localhost:5050/](http://localhost:5050/)
- API de animais: [http://localhost:5050/api/animais](http://localhost:5050/api/animais)

## Banco de dados

O projeto utiliza SQLite para armazenar os animais de forma persistente, com o Entity Framework Core responsável pela comunicação com o banco.

A classe `AnimalEntity` representa os animais cadastrados, contendo as seguintes propriedades:

- `Id`: identificador único do animal.
- `Nome`: nome do animal.
- `Saudavel`: indica se o animal está saudável.

O `ApiDbContext` gerencia o acesso ao banco por meio do `DbSet<AnimalEntity>`.

As operações de cadastro, atualização e exclusão utilizam `SaveChangesAsync()` para salvar as alterações.

Os registros não excluídos permanecem armazenados mesmo após reiniciar a aplicação.

## Endpoints

| Método | Rota                | Descrição                    | Resposta       |
| ------ | ------------------- | ---------------------------- | -------------- |
| GET    | `/api/animais`      | Lista todos os animais       | 200 OK         |
| GET    | `/api/animais/{id}` | Busca um animal pelo ID      | 200 OK         |
| POST   | `/api/animais`      | Cadastra um novo animal      | 201 Created    |
| PUT    | `/api/animais/{id}` | Atualiza um animal existente | 200 OK         |
| DELETE | `/api/animais/{id}` | Exclui um animal             | 204 No Content |

As operações GET por ID, PUT e DELETE retornam `404 Not Found` quando o animal solicitado não existe.

### Cadastrar animal com POST

```http
POST http://localhost:5050/api/animais
Content-Type: application/json

{
  "nome": "Mula",
  "saudavel": true
}
```

### Atualizar animal com PUT

```http
PUT http://localhost:5050/api/animais/3
Content-Type: application/json

{
  "nome": "Jumento",
  "saudavel": false
}
```

### Excluir animal com DELETE

```http
DELETE http://localhost:5050/api/animais/3
```

## Interface web

A interface está localizada na pasta `wwwroot/` e se comunica diretamente com os endpoints da API por meio de requisições HTTP utilizando `fetch()`.

Pela interface, é possível:

- Visualizar os animais cadastrados no banco.
- Cadastrar novos animais.
- Editar as informações de animais existentes.
- Excluir animais cadastrados.

Após as operações, a interface atualiza os dados consultando a API, sem usar dados prontos.

## Testes com Bruno

A Collection de testes está armazenada na pasta `Bruno/` do repositório.

Ela contém requisições para testar os cinco endpoints da API: GET da coleção, GET por ID, POST, PUT e DELETE.

Os testes permitem verificar os códigos HTTP retornados, as informações dos animais e a persistência das operações no banco de dados.

## Observações

- O projeto mantém o tema e o repositório utilizados na AP1.
- O armazenamento em memória foi substituído pelo SQLite.
- O Entity Framework Core é utilizado para consultar e modificar os registros.
- Os dados permanecem disponíveis após reiniciar a API.
- Os IDs são gerados automaticamente pelo banco e não precisam ser reutilizados após uma exclusão.
- O arquivo SQLite local com dados de teste não deve ser versionado no Git.
- As migrations permitem preparar o banco de dados em outro ambiente.

## Vídeo de demonstração — AP2

[Link do vídeo de demonstração](INSERIR_LINK_AQUI)
