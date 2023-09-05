using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

// [assembly: InternalsVisibleTo("DealFortress.Modules.Categories.Tests.Integration")]

namespace DealFortress.Modules.Categories.Core.DAL;

    public class CategoriesContext : DbContext, IDbContext
    {
        public CategoriesContext (DbContextOptions<CategoriesContext> options)
            : base(options)
        {
        }

        public DbSet<Domain.Entities.Category> Categories { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("categoriesContext");
        }
    }
