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

        Context.Notices.Add(
            new Notice
            {
                Id = 1,
                Title = "title 1",
                Description = "description",
                City = "city",
                Payments = "cast,swish",
                DeliveryMethods = "mail,delivered",
                CreatedAt = new DateTime()
            }
        );
        Context.Notices.Add(
            new Notice
            {
                Id = 2,
                Title = "title 2",
                Description = "description",
                City = "city",
                Payments = "cast,swish",
                DeliveryMethods = "mail,delivered",
                CreatedAt = new DateTime()
            }
        );
        Context.SaveChanges();
    }

    public void Dispose()
    {
        Context.Dispose();
    }
}
