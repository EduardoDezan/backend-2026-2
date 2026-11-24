# API de Gerenciamento de Zoológicos

Este projeto é uma API REST para gerenciamento de animais de um zoológico, desenvolvida com ASP.NET Core e .NET 10. É a continuação do meu projeto da AP1, substituindo o armazenamento em memória por um banco de dados SQLite utilizando Entity Framework Core.

A API também tem uma interface web integrada, permitindo listar, cadastrar, editar e excluir animais diretamente pelo navegador.

## Requisitos do projeto

- .NET SDK 10.0 ou superior.
- Entity Framework Core.
- SQLite.
- Bruno para testar as requisições HTTP.
- Navegador web para acessar a interface.

## Estrutura do projeto

```text
ApiZoologico/
├── Models/
│   └── AnimalEntity.cs  > Representa os animais armazenados no banco;
├── DTOs/
│   └── AnimalDto.cs     > Define os dados recebidos nas requisições;
├── Data/
│   └── ApiDbContext.cs  > Gerencia o acesso ao banco de dados;
│
├── Migrations/          > Armazena as alterações da estrutura do banco de dados;
│
├── wwwroot/             > Arquivos do frontend;
│   ├── app.js
│   ├── index.html
│   └── style.css
├── Program.cs           > Aplicação, middlewares e endpoints;
│
├── appsettings.json     > Armazena configurações, incluindo a conexão com o banco;
│
└── ApiZoologico.csproj  > Dependências e configurações do projeto.
```

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
PUT http://localhost:5050/api/animais/1
Content-Type: application/json

{
  "nome": "Jumento",
  "saudavel": false
}
```

### Excluir animal com DELETE

```http
DELETE http://localhost:5050/api/animais/1
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

- O projeto mantém o tema e o repositório utilizados na AP1 e AP2.
- Os dados permanecem disponíveis após reiniciar a API.
- Os IDs são gerados automaticamente pelo banco e não precisam ser reutilizados após uma exclusão.
- O comando dotnet ef database update aplica as migrations e cria ou atualiza o banco SQLite.
- As migrations permitem preparar o banco de dados em outro ambiente.
- As migrations registram as alterações na estrutura do banco, não foi usado o EnsureCreated().

## Vídeo de demonstração — AS

[Link do vídeo de demonstração](https://drive.google.com/file/d/18aiFRf2pET7bJ0SlfvufBBNtDDjhODjz/view)
