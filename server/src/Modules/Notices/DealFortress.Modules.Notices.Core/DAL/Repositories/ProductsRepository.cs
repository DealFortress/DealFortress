using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Entities;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class ProductsRepository : Repository<Product>, IProductsRepository
{

    public ProductsRepository(NoticesContext context) : base(context)
    {}

    public IQueryable<Product> GetAllPaged(GetProductsParams param){
        var entities = NoticesContext!.Products
                    .Include(product => product.Images)
                    .Where(product => param.NoticeId == null || product.Notice.Id == param.NoticeId);   

        return entities;   
    }

    public new IQueryable<Notice> GetAll()
    {
        return NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .ThenInclude(product => product.Images);
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
