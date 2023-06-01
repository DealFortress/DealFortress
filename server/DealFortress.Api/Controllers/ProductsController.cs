using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DealFortressContext _context;

        public ProductsController(DealFortressContext context)
        {
            _context = context;
        }


        [HttpGet]
        public ActionResult<IEnumerable<ProductResponse>> GetProduct()
        {
            return _context.Products
                        .Include(product => product.SellAd)
                        .Include(product => product.Category)
                        .Select(product => ToProductResponse(product))
                        .ToList();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponse>> GetProduct(int id)
        {
          if ( _context.Products is null)
          {
              return NotFound();
          }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return ToProductResponse(product);
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

        [NonAction]
        public static ProductResponse ToProductResponse(Product product)
        {
          return new ProductResponse()
          {
            Id = product.Id,
            Name =product.Name,
            Price = product.Price,
            Receipt = product.Receipt,
            Warranty = product.Warranty,
            CategoryId = product.Category.Id,
            Condition = product.Condition,
            SellAdId = product.SellAd.Id,
            SellAdCity = product.SellAd.City,
            SellAdDeliveryMethod = product.SellAd.DeliveryMethod,
            SellAdPayment = product.SellAd.Payment
          };
        }
        
        [NonAction]
        public Product ToProduct(ProductRequest request, SellAd sellAd)
        {
            var category = _context.Categories.Find(request.CategoryId);

            return new Product()
            {
                Name = request.Name,
                Price = request.Price,
                Receipt = request.Receipt,
                Warranty = request.Warranty,
                Category = category!,
                Condition = request.Condition,

                SellAd = sellAd
            };
        }
    }
}
