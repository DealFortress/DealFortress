using DealFortress.Api.Data;
using Microsoft.EntityFrameworkCore;
    public class CategoryContext : DbContext, IDbContext
    {
        public CategoryContext (DbContextOptions<CategoryContext> options)
            : base(options)
        {
        }
        public DbSet<DealFortress.Api.Modules.Categories.Category> Categories { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("category");
        }
    }
