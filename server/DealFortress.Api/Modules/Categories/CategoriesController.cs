using Microsoft.AspNetCore.Mvc;
using DealFortress.Api.UnitOfWork;
using DealFortress.Api.Notices;

namespace DealFortress.Api.Categories;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{

    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(DealFortressContext context, IUnitOfWork unitOfWork)
    {
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
        var category = CategoriesService.ToCategory(request);

        _unitOfWork.Categories.Add(category);
        _unitOfWork.Complete();

        return CreatedAtAction("GetCategory", new { id = category.Id }, CategoriesService.ToCategoryResponse(category));
    }
}
