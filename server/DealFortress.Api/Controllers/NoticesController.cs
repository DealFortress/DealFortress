using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Controllers;
using DealFortress.Api.Services;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly DealFortressContext _context;
        private readonly ProductService _productService;
        private readonly CategoriesController _categoriesController;

        public NoticesController(DealFortressContext context, ProductService productService, CategoriesController categoriesController)
        {
            _context = context;
            _categoriesController = categoriesController;
            _productService = productService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NoticeResponse>> GetNotice()
        {
            return _context.Notices
                        .Include(ad => ad.Products!)
                        .ThenInclude(product => (product.Category))
                        .Select(ad => ToNoticeResponse(ad)).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Notice>> GetNotice(int id)
        {
          if (_context.Notices == null)
          {
              return NotFound();
          }
            var Notice = await _context.Notices.FindAsync(id);

            if (Notice == null)
            {
                return NotFound();
            }

            return Notice;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotice(int id, Notice Notice)
        {
            if (id != Notice.Id)
            {
                return BadRequest();
            }

            _context.Entry(Notice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoticeExists(id))
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
        public async Task<ActionResult<NoticeResponse>> PostNotice(NoticeRequest Noticerequest)
        {
            var Notice = ToNotice(Noticerequest);

            if (Noticerequest.ProductRequests is not null)
            {
                var AllCategoriesExists = Noticerequest.ProductRequests.All(request => _categoriesController.CategoryExists(request.CategoryId));

                if (AllCategoriesExists)
                {
                    var products = Noticerequest.ProductRequests
                                                    .Select( productRequest =>
                                                    {
                                                        var category = _context.Categories.Find(productRequest.CategoryId);
                                                        return _productService.ToProduct(category!, productRequest, Notice);
                                                    });

                    Notice.Products = products.ToList();
                }
            }

            _context.Notices.Add(Notice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotice", new { id = Notice.Id }, ToNoticeResponse(Notice));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            if (_context.Notices == null)
            {
                return NotFound();
            }
            var Notice = await _context.Notices.FindAsync(id);
            if (Notice == null)
            {
                return NotFound();
            }

            _context.Notices.Remove(Notice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoticeExists(int id)
        {
            return (_context.Notices?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private NoticeResponse ToNoticeResponse(Notice Notice)
        {
            var response = new NoticeResponse()
            {
                Id = Notice.Id,
                Title = Notice.Title,
                Description = Notice.Description,
                City = Notice.City,
                Payment = Notice.Payment,
                DeliveryMethod = Notice.DeliveryMethod,
                CreatedAt = Notice.CreatedAt
            };

            if (Notice.Products is not null)
            {
                response.Products = Notice.Products.Select(product => _productService.ToProductResponse(product)).ToList();
            }

            return response;
        }

        private Notice ToNotice(NoticeRequest request)
        {
          return new Notice()
          {
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payment = request.Payment,
            Products = null,
            DeliveryMethod = request.DeliveryMethod,
            CreatedAt = DateTime.Now
          };
        }

    }
}
