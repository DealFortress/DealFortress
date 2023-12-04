using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.Domain.HubConfig;
using DealFortress.Modules.Messages.Core.Domain.HubConfig.TimerFeatures;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Messages.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly IMessagesService _service;
    private readonly IHubContext<MessageHub> _hub;

    public MessagesController(IMessagesService service, IHubContext<MessageHub> hub)
    {
        _service = service;
        _hub = hub;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<MessageResponse>> GetMessages()
    {
        var response = new List<Message>();
        new TimerManager(() => _hub.Clients.All.SendAsync("transfermessagedata", response = new List<Message>{new Message(){Id=1,Text="in",UserId=5,RecipientId=4} }));

        return Ok(response);
        // return Ok(_service.GetAll());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<MessageResponse> GetMessage(int id)
    {
       var response = _service.GetById(id);

       return response is null ? NotFound() : Ok(response);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<MessageResponse> PostMessage(MessageRequest request)
    {
        var response = _service.Post(request);
        
        return CreatedAtAction("GetMessage", new { id = response.Id }, response);
    }

}

