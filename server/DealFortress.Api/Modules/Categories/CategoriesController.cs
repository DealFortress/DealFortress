using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Api.Modules.Categories;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
 {
    private readonly ICategoriesRepository _repo;

    public CategoriesController(ICategoriesRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Category>> GetCategories()
    {
        return Ok(_repo.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<Category> GetCategory(int id)
    {
        var category = _repo.GetById(id);

         if (category == null)
        {
            return NotFound();
        }

        return Ok(CategoriesService.ToCategoryResponseDTO(category));
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


