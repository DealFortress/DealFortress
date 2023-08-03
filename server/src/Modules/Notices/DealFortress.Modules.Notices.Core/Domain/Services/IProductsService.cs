using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface IProductsService
{
    IEnumerable<ProductResponse> GetAllDTO();

    ProductResponse? PutDTOById(int id, ProductRequest request);

    Product? DeleteById(int id);

    ProductResponse ToProductResponseDTO(Product product);

    Product ToProduct(ProductRequest request, Notice notice);
}