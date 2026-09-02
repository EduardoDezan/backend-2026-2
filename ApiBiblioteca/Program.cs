using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "API está no ar!");

var livros = new List<Livro>
{
    new Livro (1, "A Bíblia", true),
    new Livro (2, "Dom Casmurro", false),
    new Livro (3, "O Alienista", true)
};

app.MapGet("/api/livros", () =>
{
    return Results.Ok(livros);
});

app.MapGet("/api/livros/{id:int}", (int id) =>
{
    var livroEncontrado = livros.Find(livro => livro.id == id);

    if (livroEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(livroEncontrado);
});

app.MapPost("/api/livros", (LivroDto dados) =>
{
    int proximoId = livros.Count + 1;
    var novoLivro = new Livro(proximoId, dados.titulo, true);
    livros.Add(novoLivro);
    return Results.Created($"/api/livros/{novoLivro.id}", novoLivro);
});

app.MapPut("/api/livros/{id:int}", (int id, LivroAtualizadoDto dados) =>
{
    int indice = livros.FindIndex(livroDaLista => livroDaLista.id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var atualizado = new Livro(id, dados.titulo, dados.disponivel);
    livros[indice] = atualizado;

    return Results.Ok(atualizado);
});

app.MapDelete("/api/livros/{id:int}", (int id) =>
{
    int indice = livros.FindIndex(livroDaLista => livroDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    livros.RemoveAt(indice);
    return Results.NoContent();
});


app.Run();

record Livro (int id, string titulo, bool disponivel);

record LivroDto (string titulo);

record LivroAtualizadoDto(string titulo, bool disponivel);