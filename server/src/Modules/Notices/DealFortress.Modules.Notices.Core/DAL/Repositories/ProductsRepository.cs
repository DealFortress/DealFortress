using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class ProductsRepository : Repository<Product>, IProductsRepository
{
    public ProductsRepository(NoticesContext context) : base(context)
    {}

    public IEnumerable<Product> GetAllWithEntities()
    {
        return NoticesContext!.Products
                        .Include(product => product.Notice)
                        .Include(product => product.Images)
                        .ToList();
    }

    public Product? GetByIdWithEntities(int id)
    {
        return NoticesContext!.Products
                        .Include(product => product.Notice)
                        .Include(product => product.Images)
                        .FirstOrDefault();
    }

    public NoticesContext? NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
