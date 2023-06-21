using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;

namespace DealFortress.Api.Services
{
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
                Products = category.Products?.Select(product => _productsService.ToProductResponse(product)).ToList()
            };
        }

        public Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };

        public bool CategoryExists(int id, DealFortressContext context)
        {
            return (context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}