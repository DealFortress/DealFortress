using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Contexts;

    public interface IDbContext: IDisposable
    {
        DbSet<TEntity> Set<TEntity>() where TEntity: class;
        int SaveChanges();
    }
