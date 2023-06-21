using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Repositories
{
    public interface IRepository<T>
    {
        public IEnumerable<T> GetAll();

        public T GetById(int id);

        public T Update(T entity);

        public void Delete(int id);

    }
}