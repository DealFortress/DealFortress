using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class ProductsRepository : Repository<Product>, IProductsRepository
{
    public ProductsRepository(NoticesContext context) : base(context)
    {}

    public new async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await NoticesContext!.Products
                        .Include(product => product.Notice)
                        .Include(product => product.Images)
                        .ToListAsync();
    }

    public new async Task<Product?> GetByIdAsync(int id)
    {
        return await NoticesContext!.Products
                        .Include(product => product.Notice)
                        .Include(product => product.Images)
                        .FirstOrDefaultAsync(product => product.Id == id);
    }

    public NoticesContext? NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
