using Microsoft.EntityFrameworkCore;
using DealFortress.Shared.Abstractions.Contexts;
using DealFortress.Modules.Notices.Core.Domain.Entities;

namespace DealFortress.Modules.Notices.Core.DAL;

    internal class NoticesContext : DbContext, IDbContext
    {
        public NoticesContext (DbContextOptions<NoticesContext> options)
            : base(options)
        {
        }

        public DbSet<DealFortress.Modules.Notices.Core.Domain.Entities.Product> Products { get; set; } = default!;
        public DbSet<DealFortress.Modules.Notices.Core.Domain.Entities.Notice> Notices { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("notices");
        }

    }
