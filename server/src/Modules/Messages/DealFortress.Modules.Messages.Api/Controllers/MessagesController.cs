using System.Security.Claims;
using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.Domain.HubConfig;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
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
    private readonly IHubContext<MessageHub, IMessagesClient> _hub;
    private readonly UsersController _usersController;

    public MessagesController(IMessagesService service, IHubContext<MessageHub, IMessagesClient> hub, UsersController usersController)
    {
        _service = service;
        _hub = hub;
        _usersController = usersController;
    }

    // [HttpGet]
    // [Authorize]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // public async Task<ActionResult<IEnumerable<MessageResponse>>> GetMessages()
    // {
    //     var response = _service.GetAll();
        

    //     await _hub.Clients.All.SendMessages(response);

    //     return Ok(response);
    // }

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
    public async Task<ActionResult<MessageResponse>> PostMessage(MessageRequest request)
    {
        var response = _service.Post(request);
        var recipientAuthId = _usersController.GetAuthIdByUserId(response.RecipientId);

        if(recipientAuthId is not null)
        {
            await _hub.Clients.User(recipientAuthId).SendMessage(response);
        }

        return CreatedAtAction("GetMessage", new { id = response.Id }, response);
    }

}

