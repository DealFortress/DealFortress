using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Services;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DealFortressContext _context;
        private readonly ProductService _productService;

        public ProductsController(DealFortressContext context, ProductService productService)
        {
            _context = context;
            _productService = productService;
        }


        [HttpGet]
        public ActionResult<IEnumerable<ProductResponse>> GetProduct()
        {
            return _context.Products
                        .Include(product => product.Notice)
                        .Include(product => product.Category)
                        .Include(product => product.Images)
                        .Select(product => _productService.ToProductResponse(product))
                        .ToList();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}


        // [HttpGet("{id}")]
        // public async Task<ActionResult<ProductResponse>> GetProduct(int id)
        // {
        //   if ( _context.Products is null)
        //   {
        //       return NotFound();
        //   }
        //     var product = await _context.Products.FindAsync(id);

        //     if (product == null)
        //     {
        //         return NotFound();
        //     }

        //     return ToProductResponse(product);
        // }


        // [HttpPost]
        // public async Task<ActionResult<Product>> PostProduct(Product product)
        // {
        //   if (_context.Products == null)
        //   {
        //       return Problem("Entity set 'DealFortressContext.Product'  is null.");
        //   }
        //     _context.Products.Add(productRequest);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        // }
