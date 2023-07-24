using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Modules.Notices.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NoticesController : ControllerBase
{
    private readonly INoticesRepository _repo;
    private readonly NoticesService _service;

    public NoticesController(INoticesRepository repository, NoticesService service)
    {
        _repo = repository;
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
    {
        var noticesWithProducts = _repo.GetAllWithProducts();
        var noticesResponse = noticesWithProducts.Select(notice => _service.ToNoticeResponseDTO(notice)).ToList();
        return Ok(noticesResponse);
    }

    [HttpGet("{id}")]
    public ActionResult<NoticeResponse> GetNotice(int id)
    {
        var notice = _repo.GetByIdWithProducts(id);

        if (notice == null)
        {
            return NotFound();
        }

        return Ok(_service.ToNoticeResponseDTO(notice));
    }

    [HttpPut("{id}")]
    public IActionResult PutNotice(int id, NoticeRequest noticeRequest)
    {
        var notice = _repo.GetById(id);

        if (notice == null)
        {
            return NotFound();
        }

        _repo.Remove(notice);
        var updatedNotice = _service.ToNotice(noticeRequest);
        updatedNotice.Id = notice.Id;

        _repo.Add(updatedNotice);
        _repo.Complete();


        return NoContent();
    }

    [HttpPost]
    public ActionResult<NoticeResponse> postNotice(NoticeRequest request)
    {
        var notice = _service.ToNotice(request);

        _repo.Add(notice);

        _repo.Complete();

        return CreatedAtAction("GetNotice", new { id = notice.Id }, _service.ToNoticeResponseDTO(notice));
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteNotice(int id)
    {
        var notice = _repo.GetByIdWithProducts(id);

        if (notice == null)
        {
            return NotFound();
        }

        _repo.Remove(notice);
        _repo.Complete();

        return NoContent();
    }
}

