using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;

namespace DealFortress.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    // private readonly DealFortressContext _context;
    // private readonly ProductsController _productsController;

    // public CategoriesController(DealFortressContext context, ProductsController productsController)
    // {
    //     _context = context;
    //     _productsController = productsController;
    // }

    // // GET: api/Categories
    // [HttpGet]
    // public async Task<ActionResult<IEnumerable<Category>>> GetCategory()
    // {
    //   if (_context.Categories == null)
    //   {
    //       return NotFound();
    //   }
    //     return await _context.Categories.ToListAsync();
    // }

    // // GET: api/Categories/5
    // [HttpGet("{id}")]
    // public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
    // {
    //   if (_context.Categories == null)
    //   {
    //       return NotFound();
    //   }
    //     var category = await _context.Categories.FindAsync(id);

    //     if (category == null)
    //     {
    //         return NotFound();
    //     }

    //     return ToCategoryResponse(category);
    // }

    // // PUT: api/Categories/5
    // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // [HttpPut("{id}")]
    // public async Task<IActionResult> PutCategory(int id, Category category)
    // {
    //     if (id != category.Id)
    //     {
    //         return BadRequest();
    //     }

    //     _context.Entry(category).State = EntityState.Modified;

    //     try
    //     {
    //         await _context.SaveChangesAsync();
    //     }
    //     catch (DbUpdateConcurrencyException)
    //     {
    //         if (!CategoryExists(id))
    //         {
    //             return NotFound();
    //         }
    //         else
    //         {
    //             throw;
    //         }
    //     }

    //     return NoContent();
    // }

    // // POST: api/Categories
    // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // [HttpPost]
    // public async Task<ActionResult<CategoryResponse>> PostCategory(CategoryRequest request)
    // {
    //     var category = ToCategory(request);

    //     _context.Categories.Add(category);
    //     await _context.SaveChangesAsync();

    //     return CreatedAtAction("GetCategory", new { id = category.Id }, ToCategoryResponse(category));
    // }

    // // DELETE: api/Categories/5
    // [HttpDelete("{id}")]
    // public async Task<IActionResult> DeleteCategory(int id)
    // {
    //     if (_context.Categories == null)
    //     {
    //         return NotFound();
    //     }
    //     var category = await _context.Categories.FindAsync(id);
    //     if (category == null)
    //     {
    //         return NotFound();
    //     }

    //     _context.Categories.Remove(category);
    //     await _context.SaveChangesAsync();

    //     return NoContent();
    // }
    // [NonAction]
    // public bool CategoryExists(int id)
    // {
    //     return (_context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
    // }

    // private static CategoryResponse ToCategoryResponse(Category category)
    // {
    //   return new CategoryResponse()
    //   {
    //     Id = category.Id,
    //     Name = category.Name,
    //     Products = category.Products?.Select(product => ProductsController.ToProductResponse(product)).ToList()
    //   };
    // }

    // private Category ToCategory(CategoryRequest request) => new Category(){ Name = request.Name };
}
