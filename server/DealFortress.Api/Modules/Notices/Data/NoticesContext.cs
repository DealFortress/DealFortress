using DealFortress.Api.Data;
using Microsoft.EntityFrameworkCore;

    public class NoticesContext : DbContext, IDbContext
    {
        public NoticesContext (DbContextOptions<NoticesContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Api.Modules.Notices.Product> Products { get; set; } = default!;
        public DbSet<DealFortress.Api.Modules.Notices.Notice> Notices { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("notices");
        }

    }
