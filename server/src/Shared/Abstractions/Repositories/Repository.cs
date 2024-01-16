using DealFortress.Shared.Abstractions.Contexts;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly IDbContext Context;

    public Repository(IDbContext context)
    {
        Context = context;
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await Context.Set<T>().ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await Context.Set<T>().FindAsync(id);
    }

    public async Task DeleteAsync(int id)
    {
<<<<<<< HEAD
        var entity = await GetByIdAsync(id);
=======
        var entity = GetById(id);
>>>>>>> a7e858eba2140eb24e0fdf3a0eb250d1d6f545ca
        if (entity is not null)
        {
            Context.Set<T>().Remove(entity);
        }
    }

    public async Task AddAsync(T entity)
    {
        await Context.Set<T>().AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await Context.Set<T>().AddRangeAsync(entities);
    }

    public void Remove(T entity)
    {
        Context.Set<T>().Remove(entity);
    }

    public void RemoveRange(IEnumerable<T> entities)
    {
        Context.Set<T>().RemoveRange(entities);
    }

    public void Update(T entity)
    {
        Context.Set<T>().Update(entity);
    }

    public void Complete()
    {
        Context.SaveChanges();
    }
    public void Dispose()
    {
        Context.Dispose();
    }
}
