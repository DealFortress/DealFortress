using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Services;

public interface ICategoriesService
{
    IEnumerable<CategoryResponse> GetAllDTO();

    CategoryResponse? GetDTOById(int id);

    CategoryResponse PostDTO(CategoryRequest request);

    CategoryResponse ToCategoryResponseDTO(Category category);

    Category ToCategory(CategoryRequest request);
}