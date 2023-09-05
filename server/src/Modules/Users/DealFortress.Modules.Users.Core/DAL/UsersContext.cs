using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Modules.Users.DealFortress.Modules.Users.Core.DAL
{
    public class UsersContext : DbContext, IDbContext
    {
      public UsersContext(DbContextOptions<UsersContext> options)
          : base(options)
      {
      }
      public DbSet<DealFortress.Modules.Users.Core.Domain.Entities.User> Users  { get; set; } = default!;

      protected override void OnModelCreating(ModelBuilder modelBuilder)      
      {
        modelBuilder.HasDefaultSchema("usersContext")
      }
    }
}