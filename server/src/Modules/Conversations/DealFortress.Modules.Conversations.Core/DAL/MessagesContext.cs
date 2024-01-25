using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Conversations.Core.DAL;
    
    public class ConversationsContext : DbContext, IDbContext
    {
        public ConversationsContext (DbContextOptions<ConversationsContext> options)
            : base(options)
        {
        }

        public DbSet<Domain.Entities.Message> Messages { get; set; } = default!;

        public DbSet<Domain.Entities.Conversation> Conversations { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("conversationsContext");
        }
    }    
