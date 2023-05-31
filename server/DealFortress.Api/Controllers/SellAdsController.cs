using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Controllers;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellAdsController : ControllerBase
    {
        private readonly DealFortressContext _context;
        private readonly ProductsController _productsController;
        private readonly CategoriesController _categoriesController;

        public SellAdsController(DealFortressContext context, ProductsController productsController, CategoriesController categoriesController)
        {
            _context = context;
            _categoriesController = categoriesController;
            _productsController = productsController;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SellAd>>> GetSellAd()
        {
          if (_context.SellAds == null)
          {
              return NotFound();
          }
            return await _context.SellAds.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SellAd>> GetSellAd(int id)
        {
          if (_context.SellAds == null)
          {
              return NotFound();
          }
            var sellAd = await _context.SellAds.FindAsync(id);

            if (sellAd == null)
            {
                return NotFound();
            }

            return sellAd;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSellAd(int id, SellAd sellAd)
        {
            if (id != sellAd.Id)
            {
                return BadRequest();
            }

            _context.Entry(sellAd).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SellAdExists(id))
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
        public async Task<ActionResult<SellAd>> PostSellAd(SellAdRequest sellAdrequest)
        {
            var sellAd = ToSellAd(sellAdrequest);

            if (sellAdrequest.ProductRequests is not null)
            {
                var AllCategoriesExists = sellAdrequest.ProductRequests.All(request => _categoriesController.CategoryExists(request.CategoryId));

                if (AllCategoriesExists)
                {
                    var products = sellAdrequest.ProductRequests.Select( productRequest => {
                        productRequest.SellAd = sellAd;
                        return _productsController.ToProduct(productRequest);
                    });
                    sellAd.Products = products.ToList();
                }
            }

            _context.SellAds.Add(sellAd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSellAd", new { id = sellAd.Id }, sellAd);
        }

        // DELETE: api/SellAds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSellAd(int id)
        {
            if (_context.SellAds == null)
            {
                return NotFound();
            }
            var sellAd = await _context.SellAds.FindAsync(id);
            if (sellAd == null)
            {
                return NotFound();
            }

            _context.SellAds.Remove(sellAd);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SellAdExists(int id)
        {
            return (_context.SellAds?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private SellAdResponse ToResponse(SellAd sellAd)
        {
            return new SellAdResponse()
            {
                Id = sellAd.Id,
                Title = sellAd.Title,
                Description = sellAd.Description,
                City = sellAd.City,
                Payment = sellAd.Payment,
                Products = sellAd.Products,
                DeliveryMethod = sellAd.DeliveryMethod
            };
        }
        private SellAd ToSellAd(SellAdRequest request)
        {
          return new SellAd()
          {
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payment = request.Payment,
            Products = null,
            DeliveryMethod = request.DeliveryMethod
          };
        }

    }
}
