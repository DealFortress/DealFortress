

using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core.Services;

    public class CategoriesService
    {
        public CategoryResponse ToCategoryResponseDTO(Category category)
        {
            return new CategoryResponse()
            {
                Id = category.Id,
                Name = category.Name,
            };
        }

        public Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };
    }
