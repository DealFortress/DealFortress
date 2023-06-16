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
        public async Task<ActionResult<NoticeResponse>> GetNotice(int id)
        {
            var notice = await _context.Notices.FindAsync(id);

            if (notice == null)
            {
                return NotFound();
            }

            return _noticeService.ToNoticeResponse(notice);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotice(int id, Notice notice)
        {
            if (id != notice.Id)
            {
                return BadRequest();
            }

            _context.Entry(notice).State = EntityState.Modified;

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
        public async Task<ActionResult<NoticeResponse>> postNotice(NoticeRequest request)
        {
            var notice = _noticeService.ToNotice(request);

            if (request.ProductRequests is not null)
            {
                var AllCategoriesExists = request.ProductRequests.All(request => _categoryService.CategoryExists(request.CategoryId, _context));

                if (AllCategoriesExists)
                {
                    var products = request.ProductRequests
                                                    .Select( productRequest =>
                                                    {
                                                        var category = _context.Categories.Find(productRequest.CategoryId);
                                                        return _productService.ToProduct(category!, productRequest, notice);
                                                    });

                    notice.Products = products.ToList();
                }
            }

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotice", new { id = notice.Id }, _noticeService.ToNoticeResponse(notice));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            var notice = await _context.Notices.FindAsync(id);
            
            if (notice == null)
            {
                return NotFound();
            }

            _context.Notices.Remove(notice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoticeExists(int id)
        {
            return (_context.Notices?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
