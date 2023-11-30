using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Tests.Integration.Fixture;

public class NoticesFixture : IDisposable
{
    public NoticesContext Context { get; set; }

    public NoticesFixture()
    {
        var dbName = DateTime.Now.Ticks.ToString();
        Context = new NoticesContext(new DbContextOptionsBuilder<NoticesContext>()
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
            Context.Notices.Add(
                new Notice
                {
                    Id = i + 10,
                    UserId = i,
                    Title = $"title {i}",
                    Description = "description",
                    City = "city",
                    Payments = "cast,swish",
                    DeliveryMethods = "mail,delivered",
                    CreatedAt = new DateTime(),
                }
            );

        }

        Context.SaveChanges();

        for (int i = 1; i < numberOfInstances + 1; i++)
        {
            Context.Products.Add(
                new Product
                {
                    Id = i + 10,
                    Name = $"Name {i}",
                    Price = 1,
                    HasReceipt = true,
                    SoldStatus = SoldStatus.Available,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    Notice = Context.Notices.First(),
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
