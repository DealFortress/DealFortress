using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Categories.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoriesService _service;

    public CategoriesController(ICategoriesService service)
    {
        _service = service;
    }


    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<CategoryResponse>> GetCategories()
    {
        return Ok(_service.GetAllDTO());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<CategoryResponse> GetCategory(int id)
    {
        var response = _service.GetDTOById(id);

        return response is null ? NotFound() : Ok(response);
    }


    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<CategoryResponse> PostCategory(CategoryRequest request)
    {
        var response = _service.PostDTO(request);
        return CreatedAtAction("GetCategory", new { id = response.Id }, response);
    }

    [NonAction]
    public string? GetCategoryNameById(int id)
    {
        return _service.GetDTOById(id)?.Name;
    }
}


