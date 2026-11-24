using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

using ApiZoologico.Models;
using ApiZoologico.Dtos;
using ApiZoologico.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();  

// rodar o site  dotnet run --urls http://localhost:5050

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno, tente novamente mais tarde."
        });
    });
});

app.MapGet("/api/animais", async (ApiDbContext db) =>
{
    var animais = await db.Animais.ToListAsync();
    return Results.Ok(animais);
});

app.MapGet("/api/animais/{id}", async (int id, ApiDbContext db) =>
{
    var animal = await db.Animais.FindAsync(id);

    if (animal is null) return Results.NotFound();
    else return Results.Ok(animal);
});

app.MapPost("/api/animais", async (AnimalEntity dados, ApiDbContext db) =>
{
    db.Animais.Add(dados);
    await db.SaveChangesAsync();
    return Results.Created($"/api/animais/{dados.Id}", dados);
});

app.MapPut("/api/animais/{id}", async (int id, AnimalEntity dados, ApiDbContext db) =>
{
    var animal = await db.Animais.FindAsync(id);
    if (animal is null) return Results.NotFound();

    animal.Nome = dados.Nome;
    animal.Saudavel = dados.Saudavel;

    await db.SaveChangesAsync();

    return Results.Ok(animal);
});

app.MapDelete("/api/animais/{id}", async (int id, ApiDbContext db) =>
{
    var animal = await db.Animais.FindAsync(id);
    if (animal is null) return Results.NotFound();

    db.Animais.Remove(animal);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();


