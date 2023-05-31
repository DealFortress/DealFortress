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
        public ActionResult<IEnumerable<SellAdResponse>> GetSellAd()
        {
            return _context.SellAds
                        .Include(ad => ad.Products!)
                        .ThenInclude(product => (product.Category))
                        .Select(ad => ToSellAdResponse(ad)).ToList();
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
        public async Task<ActionResult<SellAdResponse>> PostSellAd(SellAdRequest sellAdrequest)
        {
            // REFACTOOO
            var sellAd = ToSellAd(sellAdrequest);

            if (sellAdrequest.ProductRequests is not null)
            {
                var AllCategoriesExists = sellAdrequest.ProductRequests.All(request => _categoriesController.CategoryExists(request.CategoryId));

                if (AllCategoriesExists)
                {
                    var products = sellAdrequest.ProductRequests.Select( productRequest => {
                        return _productsController.ToProduct(productRequest, sellAd);
                    });
                    sellAd.Products = products.ToList();
                }
            }

            _context.SellAds.Add(sellAd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSellAd", new { id = sellAd.Id }, ToSellAdResponse(sellAd));
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

        private static SellAdResponse ToSellAdResponse(SellAd sellAd)
        {
            var response = new SellAdResponse()
            {
                Id = sellAd.Id,
                Title = sellAd.Title,
                Description = sellAd.Description,
                City = sellAd.City,
                Payment = sellAd.Payment,
                DeliveryMethod = sellAd.DeliveryMethod
            };

            if (sellAd.Products is not null)
            {
                response.Products = sellAd.Products.Select(product => ProductsController.ToProductResponse(product)).ToList();
            }

            return response;
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
