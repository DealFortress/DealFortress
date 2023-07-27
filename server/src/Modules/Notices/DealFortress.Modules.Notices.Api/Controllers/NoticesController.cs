using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Modules.Notices.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NoticesController : ControllerBase
{
    private readonly NoticesService _service;

    public NoticesController(NoticesService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
    {
        return Ok(_service.GetAllDTO());
    }

    [HttpGet("{id}")]
    public ActionResult<NoticeResponse> GetNotice(int id)
    {
       var response = _service.GetDTOById(id);

       return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id}")]
    public IActionResult PutNotice(int id, NoticeRequest request)
    {
        var response = _service.PutDTOById(id, request);

        return response is null ? NotFound() : NoContent();
    }

    [HttpPost]
    public ActionResult<NoticeResponse> postNotice(NoticeRequest request)
    {
        var notice = NoticesService.ToNotice(request);

        _service.Add(notice);

        _service.Complete();

        return CreatedAtAction("GetNotice", new { id = notice.Id }, NoticesService.ToNoticeResponseDTO(notice));
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteNotice(int id)
    {
        var notice = _service.GetByIdWithProducts(id);

        if (notice == null)
        {
            return NotFound();
        }

        _service.Remove(notice);
        _service.Complete();

        return NoContent();
    }
}

