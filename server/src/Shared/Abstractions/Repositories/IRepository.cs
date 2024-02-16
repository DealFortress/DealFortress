
namespace DealFortress.Shared.Abstractions.Repositories;

public interface IRepository<T> : IDisposable where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    IQueryable<T> GetAll();
    Task<T?> GetByIdAsync(int id);
    Task DeleteAsync(int id);

    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);

    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);

    void Update(T entity);

    void Complete();
}