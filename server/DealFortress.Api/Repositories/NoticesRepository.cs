using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Repositories
{
    public class NoticesRepository
    {
        private readonly DealFortressContext _context;
        public NoticesRepository(DealFortressContext context)
        {
            _context = context;
        }
        public IEnumerable<Notice> GetAll()
        {
            return  _context.Notices
                        .Include(ad => ad.Products!)
                        .ThenInclude(product => (product.Category))
                        .ToList();
        }

        public Notice? GetById(int id) => _context.Notices.Find(id);


    }
}