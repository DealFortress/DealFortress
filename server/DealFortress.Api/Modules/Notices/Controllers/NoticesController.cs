using Microsoft.AspNetCore.Mvc;
using DealFortress.Api.UnitOfWork;
using DealFortress.Api.Categories;

namespace DealFortress.Api.Notices
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public NoticesController(DealFortressContext context, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
        {
            var noticesWithProducts = _unitOfWork.Notices.GetAllWithProducts();
            var noticesResponse = noticesWithProducts.Select(notice => NoticesService.ToNoticeResponse(notice));
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

            return Ok(NoticesService.ToNoticeResponse(notice));
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
            var updatedNotice = NoticesService.ToNotice(noticeRequest);
            updatedNotice.Id = notice.Id;

            _unitOfWork.Notices.Add(updatedNotice);
            _unitOfWork.Complete();


            return NoContent();
        }

        [HttpPost]
        public ActionResult<NoticeResponse> postNotice(NoticeRequest request)
        {
            var notice = NoticesService.ToNotice(request);

            _unitOfWork.Notices.Add(notice);

            _unitOfWork.Complete();

            return CreatedAtAction("GetNotice", new { id = notice.Id }, NoticesService.ToNoticeResponse(notice));
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
