using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Controllers;
using DealFortress.Api.Services;
using DealFortress.Api.Repositories;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ProductsService _productsService;
        private readonly CategoriesService _categoriesService;
        private readonly NoticesService _noticesService;
        
        public NoticesController(DealFortressContext context, ProductsService productsService, CategoriesService categoriesService, NoticesService noticesService, UnitOfWork unitOfWork)
        {
          
            _categoriesService = categoriesService;
            _productsService = productsService;
            _noticesService = noticesService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
        {
           return _unitOfWork.Notices.GetAll().Select(ad => _noticesService.ToNoticeResponse(ad)).ToList();
        }

        [HttpGet("{id}")]
        public  ActionResult<NoticeResponse> GetNotice(int id)
        {
            var notice = _unitOfWork.Notices.GetById(id);

            if (notice == null)  
            {
                return NotFound();
            }

            return _noticesService.ToNoticeResponse(notice);
        }

        [HttpPut("{id}")]
        public IActionResult PutNotice(int id, NoticeRequest noticeRequest)
        {
            _context.Entry(noticeRequest).State = EntityState.Modified;

            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<NoticeResponse>> postNotice(NoticeRequest request)
        {
            var notice = _noticesService.ToNotice(request);

            if (request.ProductRequests is not null)
            {
                var AllCategoriesExists = request.ProductRequests.All(request => _categoriesService.CategoryExists(request.CategoryId, _context));

                if (AllCategoriesExists)
                {
                    var products = request.ProductRequests
                                                    .Select( productRequest =>
                                                    {
                                                        var category = _context.Categories.Find(productRequest.CategoryId);
                                                        return _productsService.ToProduct(category!, productRequest, notice);
                                                    });

                    notice.Products = products.ToList();
                }
            }

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotice", new { id = notice.Id }, _noticesService.ToNoticeResponse(notice));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotice(int id)
        {
           var notice = _unitOfWork.Notices.GetById(id);
           
            if (notice == null)
            {
                return NotFound();
            }

            _unitOfWork.Notices.Remove(notice);
            _unitOfWork.Complete();

            return NoContent();
        }

        private bool NoticeExists(int id)
        {
            return (_unitOfWork.Notices?.GetAll().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
