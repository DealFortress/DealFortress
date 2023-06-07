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
                .Include(product => product.Images)
                .Select(product => ToProductResponse(product))
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

        [NonAction]
        public static ProductResponse ToProductResponse(Product product)
        {
          return new ProductResponse()
          {
            Id = product.Id,
            Name =product.Name,
            Price = product.Price,
            HasReceipt = product.HasReceipt,
            Warranty = product.Warranty,
            CategoryId = product.Category.Id,
            CategoryName = product.Category.Name,
            Condition = product.Condition,
            Images = product.Images,
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

            var images = request.Images.Select(image => new Image{Url = image.Url, Description = image.Description}).ToList();

            return new Product()
            {
                Name = request.Name,
                Price = request.Price,
                HasReceipt = request.HasReceipt,
                Warranty = request.Warranty,
                Images = images,
                Category = category!,
                Condition = request.Condition,
                IsSold = false,
                IsSoldSeparately =false,
                SellAd = sellAd
            };
        }
    }
}

        // these will probably not be needed

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
