
namespace DealFortress.Api.Repositories;

public interface IRepository<T> : IDisposable where T : class
{
    IEnumerable<T> GetAll();
    T? GetById(int id);
    void Delete(int id);

    void Add(T entity);
    void AddRange(IEnumerable<T> entities);

    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);

    void Complete();
}