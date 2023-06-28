using Microsoft.AspNetCore.Mvc;
using DealFortress.Api.Models;
using DealFortress.Api.Services;
using DealFortress.Api.UnitOfWork;

namespace DealFortress.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
 {
    private readonly ProductsService _productsService;
    private readonly CategoriesService _categoriesService;

    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(DealFortressContext context, ProductsService productsService, CategoriesService categoriesService, IUnitOfWork unitOfWork)
    {
      
        _productsService = productsService;
        _categoriesService = categoriesService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Category>> GetCategory()
    {
        return Ok(_unitOfWork.Categories.GetAll());
    }

    [HttpPost]
    public ActionResult<CategoryResponse> PostCategory(CategoryRequest request)
    {
        var category = _categoriesService.ToCategory(request);

        _unitOfWork.Categories.Add(category);
        _unitOfWork.Complete();

        return CreatedAtAction("GetCategory", new { id = category.Id }, _categoriesService.ToCategoryResponse(category));
    }
}
