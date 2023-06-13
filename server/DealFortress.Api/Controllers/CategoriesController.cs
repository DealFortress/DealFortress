using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Services;

namespace DealFortress.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly DealFortressContext _context;
    private readonly ProductService _productService;
    private readonly CategoryService _categoryService;

    public CategoriesController(DealFortressContext context, ProductService productService, CategoryService categoryService)
    {
        _context = context;
        _productService = productService;
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategory()
    {
      if (_context.Categories == null)
      {
          return NotFound();
      }
        return await _context.Categories.ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
    {
      if (_context.Categories == null)
      {
          return NotFound();
      }
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return _categoryService.ToCategoryResponse(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCategory(int id, Category category)
    {
        if (id != category.Id)
        {
            return BadRequest();
        }

        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_categoryService.CategoryExists(id, _context))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }


    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> PostCategory(CategoryRequest request)
    {
        var category = _categoryService.ToCategory(request);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategory", new { id = category.Id }, _categoryService.ToCategoryResponse(category));
    }

    // DELETE: api/Categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        if (_context.Categories == null)
        {
            return NotFound();
        }
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
