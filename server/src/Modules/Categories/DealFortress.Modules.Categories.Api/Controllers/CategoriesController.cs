using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.AspNetCore.Authorization;
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
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetCategoriesAsync()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    [ActionName("GetCategoryAsync")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryResponse>> GetCategoryAsync(int id)
    {
        var response = await _service.GetByIdAsync(id);

        return response is null ? NotFound() : Ok(response);
    }


    [HttpPost]
    [Authorize(Policy = "PostCategories")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CategoryResponse>> PostCategoryAsync(CategoryRequest request)
    {
        var response = await _service.PostAsync(request);
        return CreatedAtAction("GetCategoryAsync", new { id = response.Id }, response);
    }

    [NonAction]
    public virtual async Task<string?> GetCategoryNameById(int id)
    {
        var entity = await _service.GetByIdAsync(id);
        return entity?.Name;
    }
}


