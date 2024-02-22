using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface IProductsService
{
    Task<IEnumerable<ProductResponse>> GetAllAsync();

    Task<ProductResponse?> PutByIdAsync(int id, ProductRequest request);

    Task<Product?> DeleteByIdAsync(int id);

    Task<ProductResponse?> PatchSoldStatusByIdAsync(int id, SoldStatus soldStatus);

}