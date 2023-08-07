using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Tests.Integration.Fixture;

public class NoticesFixture : IDisposable
{
    public NoticesContext Context { get; set; }

    public NoticesFixture()
    {
        Context = new NoticesContext(new DbContextOptionsBuilder<NoticesContext>()
                                            .UseInMemoryDatabase(databaseName: "tests")
                                            .Options);
    }

    public void Initialize()
    {
        
        if (Context.Notices.Any())
        {
            Context.Notices.RemoveRange(Context.Notices);
            Context.SaveChanges();
        }
        CreateTestNotices(2);
        Context.SaveChanges();
    }

    public void CreateTestNotices(int numberOfInstances)
    {
        for (int i = 1; i < numberOfInstances + 1; i++)
        {
            Context.Notices.Add(
                new Notice
                {
                    // Id = i,
                    Title = $"title {i}",
                    Description = "description",
                    City = "city",
                    Payments = "cast,swish",
                    DeliveryMethods = "mail,delivered",
                    CreatedAt = new DateTime()
                }
            );

        }
    }

    public void Dispose()
    {
        Context.Dispose();
    }
}
