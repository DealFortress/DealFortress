using Microsoft.EntityFrameworkCore;
    public class CategoryContext : DbContext
    {
        public CategoryContext (DbContextOptions<DealFortressContext> options)
            : base(options)
        {
        }
        public DbSet<DealFortress.Api.Modules.Categories.Category> Categories { get; set; } = default!;


    }
