using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;

namespace DealFortress.Api.Repositories
{
    public interface INoticesRepository: IRepository<Notice>
    {
        IEnumerable<Notice> GetAllWithProducts();

        Notice? GetByIdWithProducts(int id);
    }
}