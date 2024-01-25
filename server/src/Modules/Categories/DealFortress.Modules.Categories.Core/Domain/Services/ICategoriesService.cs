using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Domain.Services;

public interface ICategoriesService
{
    IEnumerable<CategoryResponse> GetAll();

    CategoryResponse? GetById(int id);

    CategoryResponse Post(CategoryRequest request);

    CategoryResponse ToCategoryResponseDTO(Category category);

    Category ToCategory(CategoryRequest request);
}