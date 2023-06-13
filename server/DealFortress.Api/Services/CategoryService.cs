using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;

namespace DealFortress.Api.Services
{
    public class CategoryService
    {

        private readonly ProductService _productService;
        public CategoryService(ProductService productService)
        {
            _productService = productService; 
        }

        public CategoryResponse ToCategoryResponse(Category category)
        {
            return new CategoryResponse()
            {
                Id = category.Id,
                Name = category.Name,
                Products = category.Products?.Select(product => _productService.ToProductResponse(product)).ToList()
            };
        }

        public Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };

        public bool CategoryExists(int id, DealFortressContext context)
        {
            return (context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}