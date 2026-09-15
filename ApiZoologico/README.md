# API de Gerenciamento de Zoológicos

Este projeto é uma API REST para gerenciamento de animais de um zoológico em um modelo minimalista, desenvolvida com ASP.NET Core e .NET 10.

## Requisitos do projeto

* .NET SDK 10.0 ou superior.

## Como executar o projeto

Na raiz do projeto, execute:

```bash
dotnet run --urls http://localhost:5050
```

A API estará disponível em:

* HTTP: `http://localhost:5050`

Para verificar se a API está funcionando:

```text
GET http://localhost:5050/
```

Resposta esperada:

```text
o Zoológico está aberto!
```

## Endpoints

| Método | Rota                    | Descrição                    |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/animais`          | Lista todos os animais, retorna 200 Ok |
| GET    | `/api/animais/{id:int}` | Busca um animal pelo ID, retorna 200 Ok |
| POST   | `/api/animais`          | Cadastra um novo animal, retorna 201 Created |
| PUT    | `/api/animais/{id:int}` | Atualiza um animal existente, retorna 200 Ok |
| DELETE | `/api/animais/{id:int}` | Remove um animal, retorna 204 No Content |

### Cadastrar animal com POST

```text
POST http://localhost:5050/api/animais
Content-Type: application/json

{
  "nome": "Mula",
  "saudavel": true
}
```

### Atualizar animal

```text
PUT http://localhost:5050/api/animais/3
Content-Type: application/json

{
  "nome": "Jumento",
  "saudavel": false
}
```

## Observações

* A aplicação inicia com três animais cadastrados.
* Os dados ficam armazenados somente em memória e são perdidos ao reiniciar a aplicação.
* Não é utilizado banco de dados.
* Operações para um ID inexistente, no GET, PUT e DELETE, retornam HTTP `404 Not Found`.
* A Collection do Bruno está armazenada na pasta `Bruno`.
* A API utiliza uma `List<T>` para armazenar os animais.

## [Link do vídeo]()