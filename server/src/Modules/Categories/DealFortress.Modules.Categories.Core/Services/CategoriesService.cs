using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Services;

public class CategoriesService : ICategoriesService
{
    private readonly ICategoriesRepository _repo;
    public CategoriesService(ICategoriesRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();

        return entities
                .Select(ToCategoryResponseDTO)
                .ToList();
    }

    public async Task<CategoryResponse?> GetByIdAsync(int id)
    {
        var category = await _repo.GetByIdAsync(id);
        
        if (category is null)
        {
            return null;
        }

        return ToCategoryResponseDTO(category);
    }

    public async Task<CategoryResponse> PostAsync(CategoryRequest request) // Refactor for error handling
    {
        var category = ToCategory(request);

        await _repo.AddAsync(category);
        _repo.Complete();

        return ToCategoryResponseDTO(category);
    }

    public CategoryResponse ToCategoryResponseDTO(Category category)
    {
        return new CategoryResponse()
        {
            Id = category.Id,
            Name = category.Name,
        };
    }

    public Category ToCategory(CategoryRequest request) => new Category() { Name = request.Name };
}
