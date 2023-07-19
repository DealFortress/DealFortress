using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Api.Modules.Notices;

[Route("api/[controller]")]
[ApiController]
public class NoticesController : ControllerBase
{
    private readonly INoticesRepository _repo;

    public NoticesController(INoticesRepository repository)
    {
        _repo = repository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
    {
        var noticesWithProducts = _repo.GetAllWithProducts();
        var noticesResponse = noticesWithProducts.Select(notice => NoticesService.ToNoticeResponseDTO(notice)).ToList();
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

        return Ok(NoticesService.ToNoticeResponseDTO(notice));
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
        var updatedNotice = NoticesService.ToNotice(noticeRequest);
        updatedNotice.Id = notice.Id;

        _repo.Add(updatedNotice);
        _repo.Complete();


        return NoContent();
    }

    [HttpPost]
    public ActionResult<NoticeResponse> postNotice(NoticeRequest request)
    {
        var notice = NoticesService.ToNotice(request);

        _repo.Add(notice);

        _repo.Complete();

        return CreatedAtAction("GetNotice", new { id = notice.Id }, NoticesService.ToNoticeResponseDTO(notice));
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

    private bool NoticeExists(int id)
    {
        return (_repo?.GetAll().Any(e => e.Id == id)).GetValueOrDefault();
    }
}

