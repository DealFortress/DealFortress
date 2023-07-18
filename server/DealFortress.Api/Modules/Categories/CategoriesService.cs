using DealFortress.Api.Models;

namespace DealFortress.Api.Modules.Categories;

    public static class CategoriesService
    {
        public static CategoryResponse ToCategoryResponseDTO(Category category)
        {
            return new CategoryResponse()
            {
                Id = category.Id,
                Name = category.Name,
            };
        }

        public static Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };

        public static bool CategoryExists(int id, DealFortressContext context)
        {
            return (context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
