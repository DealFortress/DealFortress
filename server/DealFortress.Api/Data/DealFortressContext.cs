using DealFortress.Api.Data;
using Microsoft.EntityFrameworkCore;

    public class DealFortressContext : DbContext, IDbContext
    {
        public DealFortressContext (DbContextOptions<DealFortressContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Api.Models.Image> Images { get; set; } = default!;
        public DbSet<DealFortress.Api.Modules.Notices.Product> Products { get; set; } = default!;
        public DbSet<DealFortress.Api.Modules.Notices.Notice> Notices { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("dealFortress");
        }

    }
