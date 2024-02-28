using Bogus;
using DealFortress.Modules.Categories.Core.DAL;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.DAL;
using DealFortress.Modules.Users.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DealFortress.Modules.Notices.Core.Domain.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        using (var context = new NoticesContext(scope.ServiceProvider.GetRequiredService<DbContextOptions<NoticesContext>>()))
        {

            var categoryContext = new CategoriesContext(scope.ServiceProvider.GetRequiredService<DbContextOptions<CategoriesContext>>());
            var categories = categoryContext.Categories.ToList();

            var usersContext = new UsersContext(scope.ServiceProvider.GetRequiredService<DbContextOptions<UsersContext>>());
            var users = usersContext.Users.ToList();

            var cityNames = new string[]{
                "Huddinge",
                "Jokkmokk",
                "Göteborg",
                "Gällivare",
                "Umeå",
                "Piteå",
                "Malmö",
                "Östersund"
            };

            var descriptions = new string[]{
                "Hej! Som rubrik lyder är jag på jakt efter en Razer Viper Mini Signature Edition, gärna i så nära nyskick det går ",
                "Säljer av ett gäng grafikkort som legat på min hylla ett tag.\nHar i vanlig ordning mer projekt än tid så får göra lite plats för andra porjekt.\nJag vet inte vad det är för modeller mer än att det är ett RX 580 som är ett gamalt miningkort med, det har jag ej fått att funka med vanliga drivrutiner, men ger bild. Resten har fungerat när jag har testat dom men jag tar inget ansvar för funktionen. Vill ni veta modell får ni försöka läsa vad det står på bilderna.",
                "Säljer av min gamla processor med kylare på grund av uppgradering av datorn. Den har funkat klockrent och kylaren har varit kanon.",
                "Finns även ett Gigabyte Z390 M Gaming moderkort samt Corsair Vengeance DDR4 3200MHz 2x8GB RAM-minnen.",
                "Har en Anthem MRX-510 till salu, bra skick och fungerar bra.",
                "Hej har lite prylar till salu som bara ligger. Skulle helst vilja sälja allt som ett paket ",
                "DDR5 kit som jag fick i RMA från Inet. Oöppnad. Första kittet köptes Nov-22. Fick denna i ersättning Dec-23 men hade redan köpt snabbare minne. Fin RGB kit. 1-års garanti som har egentligen gått ut men tillverkaren ger sk limited life warranty."
            };



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
                "i7-8700k with 64 DDR4 3200MHz RAM with MSI Z370 Gaming Pro Carbon AC Motherboard",
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

            var motherboardNames = new string[]{
                "ASUS TUF Gaming B650-Plus WIFI",
                "ASUS Prime Z790-A WIFI",
                "MSI B760 Gaming Plus WIFI",
                "Gigabyte B650 Gaming X AX"
            };

            var coolingNames = new string[]{
                "Arctic Freezer 7 X CO",
                "Lian Li UNI FAN SL120 Reverse Infinity RGB PWM Svart",
                "Noctua NF-A14 140mm PWM",
                "Arctic P12 PWM Svart",
            };

            var peripheralNames = new string[]{
                "Kyria v2 ergo",
                "Ergodox",
                "Keychron Q1",
                "Logitech 900"
            };

            var monitorNames = new string[]{
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

            var caseNames = new string[]{
                "Hyte Y70 Touch Vit",
                "Cooler Master Ncore 100 MAX",
                "DAN Cases A4-SFX V4.1 Svart"
            };

            var SSDHDDNames = new string[]{
                "Samsung 870 EVO SATA SSD 1TB",
                "Kingston Fury Renegade M.2 NVMe SSD Gen 4 4TB"
            };
            var PCNames = new string[]{
                "MSI MEG PRospect 700R",
                "Samsung Galaxy Tab Active5 (128GB) 5G"
            };

            var miscNames = new string[]{
                "Xiaomi Mi 16-i-1 Ratchet Skruvmejsel",
            };


            var ProductsNameArrays = new Dictionary<string, string[]>();
                ProductsNameArrays["CPU"] =  CPUNames;
                ProductsNameArrays["GPU"] =  GPUNames;
                ProductsNameArrays["Motherboard"] =  motherboardNames;
                ProductsNameArrays["Cooling"] =  coolingNames;
                ProductsNameArrays["Peripherals"] =  peripheralNames;
                ProductsNameArrays["Monitor/TV"] =  monitorNames;
                ProductsNameArrays["RAM"] =  RAMNames;
                ProductsNameArrays["SSD/HDD"] =  SSDHDDNames;
                ProductsNameArrays["Case"] =  caseNames;
                ProductsNameArrays["PC"] =  PCNames;
                ProductsNameArrays["Misc"] =  miscNames;


           
            var CPUUrls = new string[]{
                "https://cdn.sweclockers.com/marknad/bild/272296?l=eyJyZXNvdXJjZSI6IjI3MjI5NiIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiJjZWM0NDM2NTA4NTliNzg2NDBmZTU4YThkMjBmNDNkNyJ9",
                "https://cdn.sweclockers.com/marknad/bild/272297?l=eyJyZXNvdXJjZSI6IjI3MjI5NyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiI3MWFiN2M5ZmY3NTA5MzYwMzYzNWVkODU3MDAyYTdjNyJ9",
            };

            var GPUUrls = new string[]{
                "https://cdn.sweclockers.com/marknad/bild/272317?l=eyJyZXNvdXJjZSI6IjI3MjMxNyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIzNTkzYjViMzA3MDlkNWQ2MjkzNTRkNWE3MDVhYTA0OSJ9",
                "https://cdn.sweclockers.com/marknad/bild/272323?l=eyJyZXNvdXJjZSI6IjI3MjMyMyIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIzZjU3MjI4MDc3MDQ0MjY4ZTk5YThjMTM5ZGMzOWQxYiJ9",
                "https://cdn.sweclockers.com/marknad/bild/272301?l=eyJyZXNvdXJjZSI6IjI3MjMwMSIsImZpbHRlcnMiOlsidD1zbGlkZSJdLCJwYXJhbXMiOltdLCJrZXkiOiIwOGNlOWM1NmQ4MTE1YjEyODBjMjI5MDlhYzFhZTgzZiJ9",

            };

            var motherboardUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6905786_9.png",
                "https://cdn.inet.se/product/688x386/6905786_10.png",
                "https://cdn.inet.se/product/688x386/6905786_11.png"
            };

            var coolingUrls = new string[]{
                "https://cdn.inet.se/product/688x386/5324364_0.png",
                "https://cdn.inet.se/product/688x386/5324364_1.png",
                "https://cdn.inet.se/product/688x386/5324364_2.png",
            };

            var peripheralUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6601832_2.png",
                "https://cdn.inet.se/product/688x386/6601832_1.png"
            };

            var monitorUrls = new string[]{
                "https://cdn.inet.se/product/688x386/2224813_3.png",
                "https://cdn.inet.se/product/688x386/2224813_0.png",
                "https://cdn.inet.se/product/688x386/2224813_1.png"
            };

            var RAMUrls = new string[]{
                "https://cdn.inet.se/product/688x386/5304947_5.png",
                "https://cdn.inet.se/product/688x386/5304947_7.png"
            };

            var caseUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6903694_12.png",
                "https://cdn.inet.se/product/688x386/6903694_15.png",
                "https://cdn.inet.se/product/688x386/6903694_9.png"
            };

            var SSDHDDUrls = new string[]{
                "https://cdn.inet.se/product/688x386/4302318_12.png",
                "https://cdn.inet.se/product/1600x900/4302318_11.png"
            };
            var PCUrls = new string[]{
                 "https://cdn.inet.se/product/688x386/6905970_0.png",
                "https://cdn.inet.se/product/688x386/6905970_4.png"
            };
            var miscUrls = new string[]{
                "https://cdn.inet.se/product/688x386/6602708_0.png",
                "https://cdn.inet.se/product/688x386/6602708_1.png"
            };

            var ImageUrlArrays = new Dictionary<string, string[]>();
            ImageUrlArrays["CPU"] =  CPUUrls;
            ImageUrlArrays["GPU"] =  GPUUrls;
            ImageUrlArrays["Motherboard"] =  motherboardUrls;
            ImageUrlArrays["Cooling"] =  coolingUrls;
            ImageUrlArrays["Peripherals"] =  peripheralUrls;
            ImageUrlArrays["Monitor/TV"] =  monitorUrls;
            ImageUrlArrays["RAM"] =  RAMUrls;
            ImageUrlArrays["SSD/HDD"] =  SSDHDDUrls;
            ImageUrlArrays["Case"] =  caseUrls;
            ImageUrlArrays["PC"] =  PCUrls;
            ImageUrlArrays["Misc"] = miscUrls;



            var notices = new Faker<Notice>()
            .RuleFor(a => a.Title, bogus => bogus.Random.ArrayElement<string>(NoticeNames))
            .RuleFor(a => a.Description, bogus => bogus.Random.ArrayElement<string>(descriptions))
            .RuleFor(a => a.City, bogus => bogus.Random.ArrayElement<string>(cityNames))
            .RuleFor(a => a.Payments, bogus => bogus.Random.ArrayElement<string>(payment))
            .RuleFor(a => a.CreatedAt, bogus => DateTime.UtcNow)
            .RuleFor(a => a.Products, bogus => null)
            .RuleFor(a => a.DeliveryMethods, bogus => bogus.Random.ArrayElement<string>(delivery))
            .RuleFor(a => a.UserId, bogus => bogus.Random.ListItem<User>(users).Id)
            .Generate(1);

            var categoryId = 1;

            context.Notices.AddRange(notices);
            context.SaveChanges();

            var products = new Faker<Product>()
            .RuleFor(a => a.Price, bogus => bogus.Random.Int(200,4000))
            .RuleFor(a => a.HasReceipt, bogus => bogus.Random.Bool())
            .RuleFor(a => a.Warranty, bogus => bogus.Random.ArrayElement<string>(new string[]{"yes", "no", "yes, one year left"}))
            .RuleFor(a => a.SoldStatus, bogus => bogus.PickRandom<SoldStatus>())
            .RuleFor(a => a.IsSoldSeparately, bogus => bogus.Random.Bool())
            .RuleFor(a => a.CategoryId, bogus => {
                categoryId = categories[bogus.Random.Number(0, categories.Count! - 1)].Id;
                return categoryId;
                })
            .RuleFor(a => a.Name, bogus => {
                var currentCategoryName = categories.Find(category => category.Id == categoryId)!.Name;
                var nameArray = ProductsNameArrays[currentCategoryName];
                var randomNameArrayIndex = bogus.Random.Number(0, (nameArray.Length! - 1));
                return nameArray[randomNameArrayIndex];
            })
            .RuleFor(a => a.Condition, bogus => bogus.Random.Enum<Condition>())
            .RuleFor(a => a.Notice, bogus => bogus.Random.ListItem<Notice>(notices))
            .Generate(2);

            context.Products.AddRange(products);
            context.SaveChanges();

            foreach (var product in products)
            {
                var currentCategoryName = categories.Find(category => category.Id == product.CategoryId)!.Name;
                var urlArray = ImageUrlArrays[currentCategoryName];
                var images = new List<Image>();
                foreach (var element in urlArray)
                {          
                    var image = new Faker<Image>()
                    .RuleFor(a => a.Url, bogus => element);
                    images.Add(image);
                }
                product.Images = images;
            }


            context.SaveChanges();
        }
    }
}
