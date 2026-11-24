namespace ApiZoologico.Dtos;

sealed class AnimalDto
{
    public string Nome { get; set; } = string.Empty;
    public bool Saudavel { get; set; } = true;
}