namespace ApiZoologico.Models;
public class AnimalEntity
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public bool Saudavel { get; set; } = true;
}