using AutoMapper;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Services;

public class CategoriesService : ICategoriesService
{
    private readonly ICategoriesRepository _repo;
    private readonly IMapper _mapper;
    public CategoriesService(ICategoriesRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();

        return _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryResponse>>(entities.ToList());
    }

    public async Task<CategoryResponse?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        
        if (entity is null)
        {
            return null;
        }

        return _mapper.Map<Category, CategoryResponse>(entity);
    }

    public async Task<CategoryResponse> PostAsync(CategoryRequest request) // Refactor for error handling
    {
        var entity = _mapper.Map<CategoryRequest, Category>(request);

        await _repo.AddAsync(entity);
        _repo.Complete();

        return _mapper.Map<Category, CategoryResponse>(entity);
    }
}
