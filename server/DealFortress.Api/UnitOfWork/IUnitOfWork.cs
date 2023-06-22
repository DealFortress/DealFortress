using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        INoticesRepository Notices { get; }
        ICategoriesRepository Categories {get; }
        int Complete();
    }
}