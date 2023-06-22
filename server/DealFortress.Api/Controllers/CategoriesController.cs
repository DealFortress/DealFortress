using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Services;
using DealFortress.Api.Repositories;

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


    [HttpGet("{id}")]
    public ActionResult<CategoryResponse> GetCategory(int id)
    {
        var category = _unitOfWork.Categories.GetById(id);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(_categoriesService.ToCategoryResponse(category));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> PostCategory(CategoryRequest request)
    {
        var category = _categoriesService.ToCategory(request);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategory", new { id = category.Id }, _categoriesService.ToCategoryResponse(category));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
