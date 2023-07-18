using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Api.Modules.Categories;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
 {
    private readonly CategoriesRepository _repo;

    public CategoriesController(CategoriesRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Category>> GetCategory()
    {
        return Ok(_repo.GetAll());
    }

    [HttpPost]
    public ActionResult<CategoryResponse> PostCategory(CategoryRequest request)
    {
        var category = CategoriesService.ToCategory(request);

        _repo.Add(category);
        _repo.Complete();

        return CreatedAtAction("GetCategory", new { id = category.Id }, CategoriesService.ToCategoryResponseDTO(category));
    }
}


