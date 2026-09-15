
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "O Zoológico está aberto!");

var animais = new List<Animal>
{
    new Animal(1, "Surucucu", true),
    new Animal(2, "Lhama", true),
    new Animal(3, "Hamster", false)
};

app.MapGet("/api/animais", () =>
{
    return Results.Ok(animais);
});

app.MapGet("/api/animais/{id:int}", (int id) =>
{
    var animalEncontrado = animais.Find(i => i.id == id);

    if (animalEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(animalEncontrado);
});

app.MapPost("/api/animais", (AnimalDto dados) =>
{
    int proximoId = animais.Count + 1;
    var novoAnimal = new Animal(proximoId, dados.nome, dados.saudavel);
    animais.Add(novoAnimal);
    return Results.Created($"/api/animais/{novoAnimal.id}", novoAnimal);
});

app.MapPut("/api/animais/{id:int}", (int id, AnimalDto dados) =>
{
    int idx = animais.FindIndex(i => i.id == id);
    if (idx == -1)
    {
        return Results.NotFound();
    }

    var atualizado = new Animal(id, dados.nome, dados.saudavel);
    animais[idx] = atualizado;
    return Results.Ok(atualizado);
});

app.MapDelete("/api/animais/{id:int}", (int id) =>
{
    int idx = animais.FindIndex(i => i.id == id);
    if (idx == -1)
    {
        return Results.NotFound();
    }

    animais.RemoveAt(idx);
    return Results.NoContent();
});

app.Run();

record Animal(int id, string nome, bool saudavel);

record AnimalDto(string nome, bool saudavel);