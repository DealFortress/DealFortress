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
        private readonly CategoryService _categoryService;
        private readonly NoticeService _noticeService;

        public NoticesController(DealFortressContext context, ProductService productService, CategoryService categoryService, NoticeService noticeService)
        {
            _context = context;
            _categoryService = categoryService;
            _productService = productService;
            _noticeService = noticeService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NoticeResponse>> GetNotice()
        {
            return _context.Notices
                        .Include(ad => ad.Products!)
                        .ThenInclude(product => (product.Category))
                        .Select(ad => _noticeService.ToNoticeResponse(ad)).ToList();
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
            var Notice = _noticeService.ToNotice(Noticerequest);

            if (Noticerequest.ProductRequests is not null)
            {
                var AllCategoriesExists = Noticerequest.ProductRequests.All(request => _categoryService.CategoryExists(request.CategoryId, _context));

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

            return CreatedAtAction("GetNotice", new { id = Notice.Id }, _noticeService.ToNoticeResponse(Notice));
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
    }
}
