// using DealFortress.Api.Repositories;
// using DealFortress.Api.Modules.Categories;
// using DealFortress.Api.Modules.Notices;

// namespace DealFortress.Api.UnitOfWork;

// public class UnitOfWork : IUnitOfWork
// {
//     private readonly DealFortressContext _context;
//     public INoticesRepository Notices { get; private set; }
//     public ICategoriesRepository Categories { get; private set; }
//     public IProductsRepository Products { get; private set; }

//     public UnitOfWork(DealFortressContext context)
//     {
//         _context = context;
//         Notices = new NoticesRepository(context);
//         Categories = new CategoriesRepository(context);
//         Products = new ProductsRepository(context);
//     }
//     public int Complete()
//     {
//         return _context.SaveChanges();
//     }

//     public void Dispose()
//     {
//         _context.Dispose();
//     }

// }
