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
                                            .UseInMemoryDatabase(databaseName: $"tests {new DateTime()}")
                                            .Options);

        this.Initialize();
    }

    public void Initialize()
    {
        CreateTestNotices(2);
        Context.SaveChanges();

        CreateTestProducts(2);
        Context.SaveChanges();
    }

    public void CreateTestNotices(int numberOfInstances)
    {
        for (int i = 1; i < numberOfInstances + 1; i++)
        {
            Context.Notices.Add(
                new Notice
                {
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
    public void CreateTestProducts(int numberOfInstances)
    {
        for (int i = 1; i < numberOfInstances + 1; i++)
        {
            Context.Products.Add(
                new Product
                {
                    Name = $"Name {i}",
                    Price = 1,
                    HasReceipt = true,
                    IsSold = false,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    Notice = Context.Notices.First()
                }
            );

        }
    }


    public void Dispose()
    {
        Context.Dispose();
        Context.Database.EnsureDeleted();
    }
}
