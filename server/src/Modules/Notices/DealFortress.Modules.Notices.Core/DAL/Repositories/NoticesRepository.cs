using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Entities;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Tests.Integration")]

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class NoticesRepository : Repository<Notice>, INoticesRepository
{
    public NoticesRepository(NoticesContext context) : base(context)
    {}

    public PaginatedList<Notice> GetAllPaginated(PaginatedParams param){
        var entities = NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .ThenInclude(product => product.Images)
                    .Where(notice => param.FilterId == null || notice.UserId == param.FilterId);   

        return PaginatedList<Notice>.Create(entities, param.PageIndex, param.PageSize);               
    }

    public new IQueryable<Notice> GetAll()
    {
        return NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .ThenInclude(product => product.Images);
    }

    public new async Task<Notice?> GetByIdAsync(int id)
    {
        return await NoticesContext!.Notices
                    .Include(notice => notice.Products!)
                    .ThenInclude(product => product.Images)
                    .FirstOrDefaultAsync(notice => notice.Id == id);
    }

    public NoticesContext? NoticesContext
    {
        get { return Context as NoticesContext; }
    }
}
