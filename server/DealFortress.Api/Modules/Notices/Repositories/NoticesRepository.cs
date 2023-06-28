using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Repositories
{
    public class NoticesRepository: Repository<Notice>, INoticesRepository
    {
        public NoticesRepository(DealFortressContext context) : base(context)
        {

        }
        public IEnumerable<Notice> GetAllWithProducts()
        {
            return  DealFortressContext.Notices
                        .Include(notice => notice.Products!)
                            .ThenInclude(product => (product.Category!))
                        .Include(notice => notice.Products!)
                            .ThenInclude(product => product.Images)
                        .ToList();
        }

        public Notice? GetByIdWithProducts(int id)
        {
            return DealFortressContext.Notices
                        .Include(notice => notice.Products!)
                            .ThenInclude(product => (product.Category!))
                        .Include(notice => notice.Products!)
                            .ThenInclude(product => product.Images)
                        .FirstOrDefault(notice => notice.Id == id);
        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}