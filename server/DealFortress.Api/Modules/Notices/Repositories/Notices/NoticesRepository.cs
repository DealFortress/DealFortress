using DealFortress.Api.Models;
using DealFortress.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Modules.Notices;

public class NoticesRepository : Repository<Notice>, INoticesRepository
{
    public NoticesRepository(DealFortressContext context) : base(context)
    {}
    
    public IEnumerable<Notice> GetAllWithProducts()
    {
        return DealFortressContext.Notices
                    .Include(notice => notice.Products!)
                    .ToList();
    }

    public Notice? GetByIdWithProducts(int id)
    {
        return DealFortressContext.Notices
                    .Include(notice => notice.Products!)
                    .FirstOrDefault(notice => notice.Id == id);
    }

    public DealFortressContext DealFortressContext
    {
        get { return Context as DealFortressContext; }
    }
}
