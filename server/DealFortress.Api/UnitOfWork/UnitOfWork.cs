using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Repositories;

namespace DealFortress.Api.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DealFortressContext _context;
        public INoticesRepository Notices { get; private set; }

        public ICategoriesRepository Categories { get; private set; }
        public UnitOfWork(DealFortressContext context)
        {
            _context = context;
            Notices = new NoticesRepository(context);
            Categories = new CategoriesRepository(context);
        }
        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

    }
}