using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface IProductsService
{
    PaginatedList<ProductResponse> GetAllPaginated(PaginatedParams param);
    
    Task<ProductResponse?> PutByIdAsync(int id, ProductRequest request);

    Task<Product?> DeleteByIdAsync(int id);

    Task<ProductResponse?> PatchSoldStatusByIdAsync(int id, SoldStatus soldStatus);

}