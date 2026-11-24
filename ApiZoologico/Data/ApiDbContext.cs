
using Microsoft.EntityFrameworkCore;
using ApiZoologico.Models;

namespace ApiZoologico.Data;

sealed class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<AnimalEntity> Animais => Set<AnimalEntity>();
}