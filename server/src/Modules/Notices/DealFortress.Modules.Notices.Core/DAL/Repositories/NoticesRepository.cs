using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Tests.Integration")]

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class NoticesRepository : Repository<Notice>, INoticesRepository
{
    public NoticesRepository(NoticesContext context) : base(context)
    {}

    public IEnumerable<Notice> GetAllWithProductsAndImages()
    {
        return NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .ThenInclude(product => product.Images)
                    .ToList();
    }

    public Notice? GetByIdWithProducts(int id)
    {
        return NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .FirstOrDefault(notice => notice.Id == id);
    }

    public NoticesContext? NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
