using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                        .Include(ad => ad.Products!)
                        .ThenInclude(product => (product.Category))
                        .ToList();
        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}