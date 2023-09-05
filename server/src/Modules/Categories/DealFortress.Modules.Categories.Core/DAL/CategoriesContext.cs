using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

// [assembly: InternalsVisibleTo("DealFortress.Modules.Categories.Tests.Integration")]

    public class CategoriesContext : DbContext, IDbContext
    {
        public CategoriesContext (DbContextOptions<CategoriesContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Modules.Categories.Core.Domain.Entities.Category> Categories { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("categoriesContext");
        }
    }
