using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Domain.Services;

public interface ICategoriesService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync();

    Task<CategoryResponse?> GetByIdAsync(int id);

    Task<CategoryResponse> PostAsync(CategoryRequest request);

    // CategoryResponse ToCategoryResponseDTO(Category category);

    // Category ToCategory(CategoryRequest request);
}