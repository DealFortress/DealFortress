using DealFortress.Modules.Users.Core.DAL;
using DealFortress.Modules.Users.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Users.Tests.Integration.Fixture;

public class UsersFixture : IDisposable
{
    public UsersContext Context { get; set; }

    public UsersFixture()
    {
        var dbName = DateTime.Now.Ticks.ToString();
        Context = new UsersContext(new DbContextOptionsBuilder<UsersContext>()
                                            .UseInMemoryDatabase(databaseName: dbName)
                                            .Options);

        this.Initialize();
    }

    public void Initialize()
    {
        CreateTestEntities(2);
    }

    public void CreateTestEntities(int numberOfInstances)
    {
        for (int i = 1; i < numberOfInstances + 1; i++)
        {
            Context.Users.Add(
                new User
                {
                    Id = i,
                    Username = $"User{i}",
                    AuthId = $"testauthid{i}",
                    Avatar = $"pgp{i}.png",
                    Email = $"user{i}@gmail.com"
                }
            );

        }

        Context.SaveChanges();
    }

    public void Dispose()
    {
        Context.Dispose();
        GC.SuppressFinalize(this);
    }
}
