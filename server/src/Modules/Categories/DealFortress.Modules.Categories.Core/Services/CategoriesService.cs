using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Services;

public class CategoriesService
{
    private readonly ICategoriesRepository _repo;
    public CategoriesService(ICategoriesRepository repo)
    {
        _repo = repo;
    }

    public IEnumerable<CategoryResponse> GetAllDTO()
    {
        return _repo.GetAll()
                    .Select(category => ToCategoryResponseDTO(category));
    }

    public CategoryResponse? GetDTOById(int id)
    {
        var category = _repo.GetById(id);
        
        if (category is null)
        {
            return null;
        }

        return ToCategoryResponseDTO(category);
    }

    public CategoryResponse PostDTO(CategoryRequest request) // Refactor for error handling
    {
        var category = ToCategory(request);

        _repo.Add(category);
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
