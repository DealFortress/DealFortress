using DealFortress.Api.Models;

namespace DealFortress.Api.Modules.Categories;

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
