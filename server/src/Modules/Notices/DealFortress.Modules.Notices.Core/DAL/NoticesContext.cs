using Microsoft.EntityFrameworkCore;
using DealFortress.Shared.Abstractions.Contexts;

namespace DealFortress.Modules.Notices.Core.DAL;

    public class NoticesContext : DbContext, IDbContext
    {
        public NoticesContext (DbContextOptions<NoticesContext> options)
            : base(options)
        {
        }

        public DbSet<Domain.Entities.Product> Products { get; set; } = default!;
        public DbSet<Domain.Entities.Notice> Notices { get; set; } = default!;
        public DbSet<Domain.Entities.Image> Images { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("noticesContext");
        }
    }    
