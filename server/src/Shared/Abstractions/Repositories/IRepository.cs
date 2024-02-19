
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Shared.Abstractions.Repositories;

public interface IRepository<T> : IDisposable where T : class
{
    PaginatedList<T> GetAllPaginated(int pageIndex, int pageSize);
    IQueryable<T> GetAll();
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task DeleteAsync(int id);
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);

    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
    void Update(T entity);
    void Complete();
}