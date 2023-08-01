using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Categories.Tests.Integration.Fixture;

public class CategoriesFixture : IDisposable
{
    public CategoriesContext context { get; set; }

    public CategoriesFixture()
    {
        context = new CategoriesContext(new DbContextOptionsBuilder<CategoriesContext>()
                                            .UseInMemoryDatabase(databaseName: "tests")
                                            .Options);
        
        context.Categories.Add(new Category{ Id = 1, Name = "test1"});
        context.Categories.Add(new Category{ Id = 2, Name = "test2"});
        context.SaveChanges();
    }

    public void Dispose()
    {
        context.Dispose();
    }
}
