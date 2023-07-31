using Microsoft.EntityFrameworkCore;
using DealFortress.Shared.Abstractions.Contexts;

namespace DealFortress.Modules.Notices.Core.DAL;

    public class NoticesContext : DbContext, IDbContext
    {
        public NoticesContext (DbContextOptions<NoticesContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Modules.Notices.Core.Domain.Entities.Product> Products { get; set; } = default!;
        public DbSet<DealFortress.Modules.Notices.Core.Domain.Entities.Notice> Notices { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("noticesContext");
        }
    }    
