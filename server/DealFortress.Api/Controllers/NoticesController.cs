using Microsoft.AspNetCore.Mvc;
using DealFortress.Api.Models;
using DealFortress.Api.Services;
using DealFortress.Api.UnitOfWork;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ProductsService _productsService;
        private readonly NoticesService _noticesService;
        
        public NoticesController(DealFortressContext context, ProductsService productsService, NoticesService noticesService, IUnitOfWork unitOfWork)
        {
            _productsService = productsService;
            _noticesService = noticesService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
        {
            var noticesWithProducts = _unitOfWork.Notices.GetAllWithProducts();
            var noticesResponse = noticesWithProducts.Select(notice => _noticesService.ToNoticeResponse(notice)).ToList();
            return Ok(noticesResponse);
        }

        [HttpGet("{id}")]
        public  ActionResult<NoticeResponse> GetNotice(int id)
        {
            var notice = _unitOfWork.Notices.GetByIdWithProducts(id);

            if (notice == null)  
            {
                return NotFound();
            }

            return Ok(_noticesService.ToNoticeResponse(notice));
        }

        [HttpPut("{id}")]
        public IActionResult PutNotice(int id, NoticeRequest noticeRequest)
        {
            var notice = _unitOfWork.Notices.GetById(id);
            
            if(notice == null)
            {
                return NotFound();
            }

            _unitOfWork.Notices.Remove(notice);
            var updatedNotice = _noticesService.ToNotice(noticeRequest);
            updatedNotice.Id = notice.Id;

            _unitOfWork.Notices.Add(updatedNotice);
            _unitOfWork.Complete();


            return NoContent();
        }

        [HttpPost]
        public ActionResult<NoticeResponse> postNotice(NoticeRequest request)
        {
            var notice = _noticesService.ToNotice(request);

            _unitOfWork.Notices.Add(notice);

            _unitOfWork.Complete();

            return CreatedAtAction("GetNotice", new { id = notice.Id }, _noticesService.ToNoticeResponse(notice));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotice(int id)
        {
            var notice = _unitOfWork.Notices.GetByIdWithProducts(id);
           
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
