using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Tests.Integration.Fixture;

public class NoticesFixture : IDisposable
{
    public NoticesContext context { get; set; }

    public NoticesFixture()
    {
        context = new NoticesContext(new DbContextOptionsBuilder<NoticesContext>()
                                            .UseInMemoryDatabase(databaseName: "tests")
                                            .Options);

        context.Notices.Add(
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
        context.Notices.Add(
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
        context.SaveChanges();
    }

    public void Dispose()
    {
        context.Dispose();
    }
}
