using Bogus;
using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Data;

public class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new DealFortressContext(serviceProvider.GetRequiredService<DbContextOptions<DealFortressContext>>()))
        {
            if(context.SellAds!.Any())
            {
                return;
            }

            var cpuNames = new string[]{};

            var products = new Faker<Product>()
            .RuleFor(a => a.Name, f => f.Name.FirstName())
            .Generate(75);

            var sellAds = new Faker<SellAd>()
            .RuleFor(a => a.Name, f => f.Name.FirstName())
            .Generate(75);




            context.SellAds.AddRange(sellAds);
            context.SaveChanges();
        }
    }
}
