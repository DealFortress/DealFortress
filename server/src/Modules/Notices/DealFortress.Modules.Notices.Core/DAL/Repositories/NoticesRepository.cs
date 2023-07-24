
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

public class NoticesRepository : Repository<Notice>, INoticesRepository
{
    public NoticesRepository(NoticesContext context) : base(context)
    {}

    public IEnumerable<Notice> GetAllWithProducts()
    {
        return NoticesContext.Notices
                    .Include(notice => notice.Products!)
                    .ToList();
    }

    public Notice? GetByIdWithProducts(int id)
    {
        return NoticesContext.Notices
                    .Include(notice => notice.Products!)
                    .FirstOrDefault(notice => notice.Id == id);
    }

    public NoticesContext NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
