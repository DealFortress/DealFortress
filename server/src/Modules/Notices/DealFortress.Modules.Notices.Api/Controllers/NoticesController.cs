using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Modules.Notices.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NoticesController : ControllerBase
{
    private readonly INoticesService _service;

    public NoticesController(INoticesService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<NoticeResponse>> GetNotices()
    {
        return Ok(_service.GetAll());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<NoticeResponse> GetNotice(int id)
    {
       var response = _service.GetById(id);

       return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<NoticeResponse> PutNotice(int id, NoticeRequest request)
    {
        var response = _service.PutById(id, request);

        return response is null ? NotFound() : Ok(response);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<NoticeResponse> PostNotice(NoticeRequest request)
    {
        var response = _service.Post(request);
        
        return CreatedAtAction("GetNotice", new { id = response.Id }, response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteNotice(int id)
    {
        var notice = _service.DeleteById(id);
        
        return notice is null ? NotFound() : NoContent();
    }
}

