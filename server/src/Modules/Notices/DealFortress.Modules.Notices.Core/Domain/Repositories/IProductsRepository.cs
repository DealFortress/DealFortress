using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Entities;
using DealFortress.Shared.Abstractions.Repositories;

namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface IProductsRepository : IRepository<Product>
{
   PaginatedList<Product> GetAllPaginated(int? userId, int pageIndex, int pageSize);
}
