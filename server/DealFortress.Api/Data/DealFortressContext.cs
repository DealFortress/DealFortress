using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Modules.Categories;

    public class DealFortressContext : DbContext
    {
        public DealFortressContext (DbContextOptions<DealFortressContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Api.Models.Image> Images { get; set; } = default!;
        public DbSet<DealFortress.Api.Models.Product> Products { get; set; } = default!;
        public DbSet<DealFortress.Api.Models.Notice> Notices { get; set; } = default!;
        public DbSet<DealFortress.Api.Models.Category> Categories { get; set; } = default!;


    }
