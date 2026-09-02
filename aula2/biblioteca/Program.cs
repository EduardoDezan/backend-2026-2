var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/ola", () => "Hello World!");

app.Run();