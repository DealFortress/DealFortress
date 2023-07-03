using DealFortress.Api.Products;

namespace DealFortress.Api.Categories;
public class CategoriesService
{

    private readonly ProductsService _productsService;
    public CategoriesService(ProductsService productsService)
    {
        _productsService = productsService;
    }

    public CategoryResponse ToCategoryResponse(Category category)
    {
        return new CategoryResponse()
        {
            Id = category.Id,
            Name = category.Name,
        };
    }

    public Category ToCategory(CategoryRequest request) => new Category() { Name = request.Name };

    public bool CategoryExists(int id, DealFortressContext context)
    {
        return (context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}