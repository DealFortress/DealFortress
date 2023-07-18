using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Data
{
    public interface IDbContext: IDisposable
    {
        DbSet<TEntity> Set<TEntity>() where TEntity: class;
        int SaveChanges();
    }
}