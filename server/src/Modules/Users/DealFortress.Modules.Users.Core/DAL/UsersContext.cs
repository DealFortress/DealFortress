using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Users.Core.DAL
{
    public class UsersContext : DbContext, IDbContext
    {
      public UsersContext(DbContextOptions<UsersContext> options)
          : base(options)
      {
      }

      public DbSet<Domain.Entities.User> Users  { get; set; } = default!;

      protected override void OnModelCreating(ModelBuilder modelBuilder)      
      {
        modelBuilder.HasDefaultSchema("usersContext");
      }
    }
}