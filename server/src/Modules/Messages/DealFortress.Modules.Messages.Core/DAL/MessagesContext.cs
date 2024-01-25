using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Messages.Core.DAL;
    
    public class MessagesContext : DbContext, IDbContext
    {
        public MessagesContext (DbContextOptions<MessagesContext> options)
            : base(options)
        {
        }

        public DbSet<Domain.Entities.Message> Messages { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("messagesContext");
        }
    }    
