using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Categories.Tests.Integration.Fixture;

public class CategoriesFixture : IDisposable
{
    public CategoriesContext Context { get; set; }

    public CategoriesFixture()
    {
        var dbName = DateTime.Now.Ticks.ToString();
        Context = new CategoriesContext(new DbContextOptionsBuilder<CategoriesContext>()
                                            .UseInMemoryDatabase(databaseName: dbName)
                                            .Options);

        this.Initialize();
    }
    
    public void Initialize()
    {
        if (Context.Categories.Any())
        {
            Context.Categories.RemoveRange(Context.Categories);
            Context.SaveChanges();
        }
        Context.Categories.Add(new Category{ Id = 1, Name = "Name 1"});
        Context.Categories.Add(new Category{ Id = 2, Name = "Name 2"});
        Context.SaveChanges();
    }

    public void Dispose()
    {
        Context.Dispose();
        GC.SuppressFinalize(this);
    }
}
