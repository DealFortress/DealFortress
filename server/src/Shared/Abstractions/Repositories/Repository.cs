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

    public async Task<IEnumerable<T>> GetAll()
    {
        return await Context.Set<T>().ToListAsync();
    }

    public async Task<T?> GetById(int id)
    {
        return await Context.Set<T>().FindAsync(id);
    }

    public async Task Delete(int id)
    {
        var entity = await GetById(id);
        if (entity is not null)
        {
            Context.Set<T>().Remove(entity);
        }
    }

    public async Task Add(T entity)
    {
        await Context.Set<T>().AddAsync(entity);
    }

    public async Task AddRange(IEnumerable<T> entities)
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
