namespace DealFortress.Api.Repositories
{
    public class Repository<T>: IRepository<T> where T: class
    {
        protected readonly DealFortressContext Context;

        public Repository(DealFortressContext context) 
        {
            Context = context;
        }

        public IEnumerable<T> GetAll()
        {
            return Context.Set<T>().ToList();
        }

        public T? GetById(int id)
        {
            return Context.Set<T>().Find(id);
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            Context.Set<T>().Remove(entity);
        }

        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
        }

        public void AddRange(IEnumerable<T> entities)
        {
            Context.Set<T>().AddRange(entities);
        }

        public void Remove(T entity)
        {
            Context.Set<T>().Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            Context.Set<T>().RemoveRange(entities);
        }
    }
}