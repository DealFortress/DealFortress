using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DealFortressContext _context;
        public INoticesRepository Notices { get; private set; }
        public UnitOfWork(DealFortressContext context)
        {
            _context = context;
            Notices = new NoticesRepository(context);
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