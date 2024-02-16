using Bogus;
using DealFortress.Modules.Categories.Core.DAL;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DealFortress.Modules.Notices.Core.Domain.Data;

public class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new NoticesContext(serviceProvider.GetRequiredService<DbContextOptions<NoticesContext>>()))
        {
            if(context.Notices!.Any())
            {
                return;
            }

            var categoryContext = new CategoriesContext(serviceProvider.GetRequiredService<DbContextOptions<CategoriesContext>>());
            var categories = categoryContext.Categories.ToList();

            var NoticeNames = new string[]
            {
                "For Sale - Acer XR34 Ultrawide Monitor",
                "Nintendo Wii Bundle & Nintendo Switch Lite",
                "Corsair dominator 5600 cl36 2x16gb",
                "GIGABYTE RX 6800 XT 5000kr + SHIPPING. PRICE DROP!",
                "PNY NVIDIA GeForce GTX 1080 Ti",
                "Ducky x ONEofZERO, Watercooling radiators",
                "Gigabyte Aurus 1080ti XTreme Ed.",
                "Ryzen 7700X BNIB, Ryzen 5600 LNIB",
                "i7-8700k with 64 DDR4 3200MHz RAM with MSI Z370 Gaming Pro Carbon AC Motherboard, RTX 2080 (FREE SHIPPING)",
                "Selling an electric lawnmower and other stuff, dm for lawnmower info",
                "CORSAIR Vengeance 32GB (2x16GB) DDR5 5600MHz CL36 Black 1.25V (CMK32GX5M2B5600C36)",
                "3070FE, HP t740, iPad Pro, 27inch LCD, P1000, EVGA PSUs",
                "Ryzen 7600X with Box - 2400kr shipped",
                "Custom MNPC Tech HWC Black Anodized 140mm fan grill 300kr each",
                "Aorus GTX 1080 ti 11GB",
                "gammal speldator, gtx 1080 i7 7700k m.m",
                "Apple Watch Ultra i mycket fint skick"
            };

            var payment = new string[]{"swish", "cash", "bank transfer"};

            var delivery = new string[]{"hand delivered", "pick up", "package"};

            var CPUNames = new string[]{
                "i3-8540k",
                "i5-13500KF",
                "i9-9900k",
                "i3-13100f",
                "i7-7700k",
                "i5-6400",
                "Ryzen 7 5800x3D",
                "Ryzen 5 3600x",
                "Ryzen 9 5950x",
                "Ryzen 3 2200g",
                "Ryzen 5 1600x",
                "AMD Athlon 64 X2 Dual Core 4200+"
            };

            var GPUNames = new string[]{
                "GIGABYTE 1080RTX",
                "4080 ULTRA BLA BLA",
                "ASUS TUF 2070 super",
                "EVGA 1080ti",
                "Electric lawnmower",
                "ASUS 750ti",
                "Sapphire Radeon RX 580 Nitro+",
                "PNY gt 1030",
                "Hella fast 980ti trust me bro",
                "ASUS ROG STRIX 960 4GB"
            };

            var MotherboardNames = new string[]{
                "ASUS TUF Gaming B650-Plus WIFI",
                "ASUS Prime Z790-A WIFI",
                "MSI B760 Gaming Plus WIFI",
                "Gigabyte B650 Gaming X AX"
            };

            var CoolingNames = new string[]{
                "Arctic Freezer 7 X CO",
                "Lian Li UNI FAN SL120 Reverse Infinity RGB PWM Svart",
                "Noctua NF-A14 140mm PWM",
                "Arctic P12 PWM Svart",
            };

            var PeripheralNames = new string[]{
                "Kyria v2 ergo",
                "Ergodox",
                "Keychron Q1",
                "Logitech 900"
            };

            var MonitorNames = new string[]{
                "GP27Q 27\"",
                "Optix G24C",
                "Odyssey G7 4k 32\"",
                "LG M27Q 32\""
            };

            var RAMNames = new string[]{
                "Kingston fury 2400mhz 4x2gb",
                "Kingston Ultra 3200mhz 8gb",
                "Corsai 4200mhz 16gb"
            };


            var ProductsNameArrays = new Dictionary<string, string[]>();
                ProductsNameArrays["CPU"] =  CPUNames;
                ProductsNameArrays["GPU"] =  GPUNames;
                ProductsNameArrays["Motherboard"] =  MotherboardNames;
                ProductsNameArrays["Cooling"] =  CoolingNames;
                ProductsNameArrays["Peripherals"] =  PeripheralNames;
                ProductsNameArrays["Monitor/TV"] =  MonitorNames;
                ProductsNameArrays["RAM"] =  RAMNames;

           
            var CPUUrls = new string[]{
                "https://cdn.sweclockers.com/marknad/bild/272296?l=eyJyZXNvdXJjZSI6IjI3MjI5NiIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiJjZWM0NDM2NTA4NTliNzg2NDBmZTU4YThkMjBmNDNkNyJ9",
                "https://cdn.sweclockers.com/marknad/bild/272297?l=eyJyZXNvdXJjZSI6IjI3MjI5NyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiI3MWFiN2M5ZmY3NTA5MzYwMzYzNWVkODU3MDAyYTdjNyJ9",
            };

            var GPUUrls = new string[]{
                "https://cdn.sweclockers.com/marknad/bild/272317?l=eyJyZXNvdXJjZSI6IjI3MjMxNyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIzNTkzYjViMzA3MDlkNWQ2MjkzNTRkNWE3MDVhYTA0OSJ9",
                "https://cdn.sweclockers.com/marknad/bild/272323?l=eyJyZXNvdXJjZSI6IjI3MjMyMyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIzZjU3MjI4MDc3MDQ0MjY4ZTk5YThjMTM5ZGMzOWQxYiJ9",
                "https://cdn.sweclockers.com/marknad/bild/272301?l=eyJyZXNvdXJjZSI6IjI3MjMwMSIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIwOGNlOWM1NmQ4MTE1YjEyODBjMjI5MDlhYzFhZTgzZiJ9",

            };

            var MotherboardUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6905786_9.png",
                "https://cdn.inet.se/product/688x386/6905786_10.png",
                "https://cdn.inet.se/product/688x386/6905786_11.png"
            };

            var CoolingUrls = new string[]{
                "https://cdn.inet.se/product/688x386/5324364_0.png",
                "https://cdn.inet.se/product/688x386/5324364_1.png",
                "https://cdn.inet.se/product/688x386/5324364_2.png",
            };

            var PeripheralUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6601832_2.png",
                "https://cdn.inet.se/product/688x386/6601832_1.png"
            };

            var MonitorUrls = new string[]{
                "https://cdn.inet.se/product/688x386/2224813_3.png",
                "https://cdn.inet.se/product/688x386/2224813_0.png",
                "https://cdn.inet.se/product/688x386/2224813_1.png"
            };

            var RAMUrls = new string[]{
                "https://cdn.inet.se/product/688x386/5304947_5.png",
                "https://cdn.inet.se/product/688x386/5304947_7.png"
            };

            var ImageUrlArrays = new Dictionary<string, string[]>();
            ImageUrlArrays["CPU"] =  CPUUrls;
            ImageUrlArrays["GPU"] =  GPUUrls;
            ImageUrlArrays["Motherboard"] =  MotherboardUrls;
            ImageUrlArrays["Cooling"] =  CoolingUrls;
            ImageUrlArrays["Peripherals"] =  PeripheralUrls;
            ImageUrlArrays["Monitor/TV"] =  MonitorUrls;
            ImageUrlArrays["RAM"] =  RAMUrls;

            var Notices = new Faker<Notice>()
            .RuleFor(a => a.Title, bogus => bogus.Random.ArrayElement<string>(NoticeNames))
            .RuleFor(a => a.Description, bogus => bogus.Lorem.Sentences(bogus.Random.Number(8)))
            .RuleFor(a => a.City, bogus => bogus.Address.City())
            .RuleFor(a => a.Payments, bogus => bogus.Random.ArrayElement<string>(payment))
            .RuleFor(a => a.CreatedAt, bogus => DateTime.UtcNow)
            .RuleFor(a => a.Products, bogus => null)
            .RuleFor(a => a.DeliveryMethods, bogus => bogus.Random.ArrayElement<string>(delivery))
            .Generate(75);

            var categoryId = 0;

            var products = new Faker<Product>()
            .RuleFor(a => a.Price, bogus => bogus.Random.Int(200,4000))
            .RuleFor(a => a.HasReceipt, bogus => bogus.Random.Bool())
            .RuleFor(a => a.Warranty, bogus => bogus.Random.ArrayElement<string>(new string[]{"yes", "no", "yes, one year left"}))
            .RuleFor(a => a.SoldStatus, bogus => bogus.PickRandom<SoldStatus>())
            .RuleFor(a => a.IsSoldSeparately, bogus => bogus.Random.Bool())
            .RuleFor(a => a.CategoryId, bogus => {
                return categories[bogus.Random.Number(0, categories.Count! - 1)].Id;
                })
            .RuleFor(a => a.Name, bogus => {
                var currentCategoryName = categories.Find(category => category.Id == categoryId)!.Name;
                var NameArray = ProductsNameArrays[currentCategoryName];
                var randomNameArrayIndex = bogus.Random.Number(0, (NameArray.Length! - 1));
                return NameArray[randomNameArrayIndex];
            })
            .RuleFor(a => a.Condition, bogus => bogus.Random.Enum<Condition>())
            .RuleFor(a => a.Notice, bogus => bogus.Random.ListItem<Notice>(Notices))
            .Generate(75);
            
            foreach (var product in products)
            {
               var image = new Faker<Image>()
                .RuleFor(a => a.Url, bogus => {
                    var currentCategoryName = categories.Find(category => category.Id == categoryId)!.Name;
                var urlArray = ImageUrlArrays[currentCategoryName];
                var randomNameArrayIndex = bogus.Random.Number(0, (urlArray.Length! - 1));
                return urlArray[randomNameArrayIndex]; 
                });
            }


            context.Notices.AddRange(Notices);
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
