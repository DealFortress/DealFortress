
namespace DealFortress.Modules.Messages.Core.DAL
{
    public class MessagesContext
    {
        public MessagesContext (DbContextOptions<MessagesContext> options)
            : base(options)
        {
        }

        public DbSet<Domain.Entities.Mesage> Messages { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("messagesContext");
        }
    }    

    }
}