using Bogus;
using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Data;

public class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
    //     using (var context = new DealFortressContext(serviceProvider.GetRequiredService<DbContextOptions<DealFortressContext>>()))
    //     {
    //         if(context.Notices!.Any())
    //         {
    //             return;
    //         }

    //         var NoticeNames = new string[]
    //         {
    //             "Selling old pc parts",
    //             "Selling sons old pc because he is acting badly",
    //             "How do I buy things, I keep accidentally selling my things",
    //             "SELLING BEST HARDWARE IN SWEDEN NOT CLICKBAIT!",
    //             "Säljer mycket bra datordelar",
    //             "Lost and found pc part in need of new owner",
    //             "In need of money for cheese, buy my old mining rig parts",
    //             "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    //             "Mom told me to sell my old parts instead of my kidney for the new 4090",
    //             "Selling an electric lawnmower and other stuff, dm for lawnmower info"
    //         };

    //         var payment = new string[]{"swish", "cash", "bank transfer"};

    //         var delivery = new string[]{"hand delivered", "pick up", "package"};

    //         var categories = context.Categories.ToList();

    //         var CPUNames = new string[]{
    //             "i3-8540k",
    //             "i5-13500KF",
    //             "i9-9900k",
    //             "i3-13100f",
    //             "i7-7700k",
    //             "i5-6400",
    //             "Ryzen 7 5800x3D",
    //             "Ryzen 5 3600x",
    //             "Ryzen 9 5950x",
    //             "Ryzen 3 2200g",
    //             "Ryzen 5 1600x",
    //             "AMD Athlon 64 X2 Dual Core 4200+"
    //         };

    //         var GPUNames = new string[]{
    //             "GIGABYTE 1080RTX",
    //             "4080 ULTRA BLA BLA",
    //             "ASUS TUF 2070 super",
    //             "EVGA 1080ti",
    //             "Electric lawnmower",
    //             "ASUS 750ti",
    //             "Sapphire Radeon RX 580 Nitro+",
    //             "PNY gt 1030",
    //             "Hella fast 980ti trust me bro",
    //             "ASUS ROG STRIX 960 4GB"
    //         };

    //         var PSUNames = new string[]{
    //             "Corsair CV series 650W",
    //             "Fract Design ION Gold 850W",
    //             "ASUS ROG STRIX 1000W Gold Aura Edition PSU",
    //             "ASUS ROG Loki SFX-L 850W PSU"
    //         };

    //         var OutdoorNames = new string[]{
    //             "lawnmower",
    //             "electric shaver",
    //             "tent airblower 34FG",
    //             "leafblower 1000",
    //         };

    //         var MouseAndKeyboardNames = new string[]{
    //             "Kyria v2 ergo",
    //             "Ergodox",
    //             "Keychron Q1",
    //             "Logitech 900"
    //         };

    //         var MonitorsNames = new string[]{
    //             "GP27Q 27\"",
    //             "Optix G24C",
    //             "Odyssey G7 4k 32\"",
    //             "LG M27Q 32\""
    //         };

    //         var RAMNames = new string[]{
    //             "Kingston fury 2400mhz 4x2gb",
    //             "Kingston Ultra 3200mhz 8gb",
    //             "Corsai 4200mhz 16gb"
    //         };

    //         var ProductsNameArrays = new Dictionary<string, string[]>();
    //             ProductsNameArrays["CPU"] =  CPUNames;
    //             ProductsNameArrays["GPU"] =  GPUNames;
    //             ProductsNameArrays["PSU"] =  PSUNames;
    //             ProductsNameArrays["Outdoor"] =  OutdoorNames;
    //             ProductsNameArrays["MouseAndKeyboard"] =  MouseAndKeyboardNames;
    //             ProductsNameArrays["Monitors"] =  MonitorsNames;
    //             ProductsNameArrays["RAM"] =  RAMNames;



    //         var Notices = new Faker<Notice>()
    //         .RuleFor(a => a.Title, bogus => bogus.Random.ArrayElement<string>(NoticeNames))
    //         .RuleFor(a => a.Description, bogus => bogus.Lorem.Sentences(bogus.Random.Number(8)))
    //         .RuleFor(a => a.City, bogus => bogus.Address.City())
    //         .RuleFor(a => a.Payment, bogus => bogus.Random.ArrayElement<string>(payment))
    //         .RuleFor(a => a.CreatedAt, bogus => DateTime.Now)
    //         .RuleFor(a => a.Products, bogus => null)
    //         .RuleFor(a => a.DeliveryMethod, bogus => bogus.Random.ArrayElement<string>(delivery))
    //         .Generate(75);

    //         var categoryId = 0;

    //         var products = new Faker<Product>()
    //         .RuleFor(a => a.Price, bogus => bogus.Random.Int(200,4000))
    //         .RuleFor(a => a.HasReceipt, bogus => bogus.Random.Bool())
    //         .RuleFor(a => a.Warranty, bogus => bogus.Random.ArrayElement<string>(new string[]{"yes", "no", "yes, one year left"}))
    //         .RuleFor(a => a.IsSold, bogus => bogus.Random.Bool())
    //         .RuleFor(a => a.IsSoldSeparately, bogus => bogus.Random.Bool())
    //         .RuleFor(a => a.Images, bogus =>
    //             {
    //                 var image = new Image(){Url="", Description=""};
    //                 image.Description = bogus.Lorem.Sentence();
    //                 image.Url = bogus.Image.PicsumUrl();
    //                 // context.Images.Add(image);
    //                 return new List<Image>(){image};
    //             })
    //         .RuleFor(a => a.Category, bogus => {
    //             categoryId = categories[bogus.Random.Number(0, categories.Count! - 1)].Id;
    //             return categories.Find(category => category.Id == categoryId);
    //             })
    //         .RuleFor(a => a.Name, bogus => {
    //             var currentCategoryName = categories.Find(category => category.Id == categoryId)!.Name;
    //             var NameArray = ProductsNameArrays[currentCategoryName];
    //             var randomNameArrayIndex = bogus.Random.Number(0, (NameArray.Length! - 1));
    //             return NameArray[randomNameArrayIndex];
    //         })
    //         .RuleFor(a => a.Condition, bogus => bogus.Random.Enum<Condition>())
    //         .RuleFor(a => a.Notice, bogus => bogus.Random.ListItem<Notice>(Notices))
    //         .Generate(75);

    //         context.Notices.AddRange(Notices);
    //         context.Products.AddRange(products);
    //         context.SaveChanges();
    //     }
    }
}
