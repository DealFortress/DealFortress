using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class ProductsRepository : Repository<Product>, IProductsRepository
{
    public ProductsRepository(NoticesContext context) : base(context)
    {}

    public IEnumerable<Product> GetAllWithEverything()
    {
        return NoticesContext!.Products
                        .Include(product => product.Notice)
                        .ToList();
    }

    public Product? GetByIdWithEverything(int id)
    {
        return NoticesContext!.Products
                        .Include(product => product.Notice)
                        .FirstOrDefault();
    }

    public NoticesContext? NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
