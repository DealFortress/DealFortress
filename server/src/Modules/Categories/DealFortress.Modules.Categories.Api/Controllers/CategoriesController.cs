using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Categories.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly CategoriesService _service;

    public CategoriesController(CategoriesService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<CategoryResponse>> GetCategories()
    {
        return Ok(_service.GetAllDTO());
    }

    [HttpGet("{id}")]
    public ActionResult<CategoryResponse> GetCategory(int id)
    {
        var response = _service.GetDTOById(id);

        return response is null ? NotFound() : Ok(response);
    }


    [HttpPost]
    public ActionResult<CategoryResponse> PostCategory(CategoryRequest request)
    {
        var response = _service.PostDTO(request);
        return CreatedAtAction("GetCategory", new { id = response.Id }, response);
    }
}


