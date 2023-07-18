using DealFortress.Api.Models;
using DealFortress.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Modules.Notices;

public class ProductsRepository : Repository<Product>, IProductsRepository
{
    public ProductsRepository(DealFortressContext context) : base(context)
    {

    }

    public IEnumerable<Product> GetAllWithEverything()
    {
        return DealFortressContext.Products
                        .Include(product => product.Notice)
                        .ToList();
    }

    public Product? GetByIdWithEverything(int id)
    {
        return DealFortressContext.Products
                        .Include(product => product.Notice)
                        .FirstOrDefault();
    }

    public DealFortressContext DealFortressContext
    {
        get { return Context as DealFortressContext; }
    }
}
