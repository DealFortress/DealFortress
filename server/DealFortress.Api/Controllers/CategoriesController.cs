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
    private readonly ProductsController _productsController;
    private readonly ProductService _productService;

    public CategoriesController(DealFortressContext context, ProductsController productsController, ProductService productService)
    {
        _context = context;
        _productsController = productsController;
        _productService = productService;
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

        return ToCategoryResponse(category);
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
            if (!CategoryExists(id))
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
        var category = ToCategory(request);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategory", new { id = category.Id }, ToCategoryResponse(category));
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
    [NonAction]
    public bool CategoryExists(int id)
    {
        return (_context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
    }

    private CategoryResponse ToCategoryResponse(Category category)
    {
      return new CategoryResponse()
      {
        Id = category.Id,
        Name = category.Name,
        Products = category.Products?.Select(product => _productService.ToProductResponse(product)).ToList()
      };
    }

    private Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };
}
