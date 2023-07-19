using DealFortress.Api.Data;
using Microsoft.EntityFrameworkCore;
    public class CategoriesContext : DbContext, IDbContext
    {
        public CategoriesContext (DbContextOptions<CategoriesContext> options)
            : base(options)
        {
        }
        public DbSet<DealFortress.Api.Modules.Categories.Category> Categories { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("categories");
        }
    }
