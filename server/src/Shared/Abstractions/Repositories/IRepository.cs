
namespace DealFortress.Shared.Abstractions.Repositories;

public interface IRepository<T> : IDisposable where T : class
{
    Task<IEnumerable<T>> GetAll();
    Task<T?> GetById(int id);
    Task Delete(int id);

    Task Add(T entity);
    Task AddRange(IEnumerable<T> entities);

    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);

    void Update(T entity);

    void Complete();
}