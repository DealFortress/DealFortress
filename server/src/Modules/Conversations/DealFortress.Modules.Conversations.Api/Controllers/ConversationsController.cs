using System.Security.Claims;
using DealFortress.Modules.Conversations.Core.Domain.Clients;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.HubConfig;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Conversations.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ConversationsController : ControllerBase
{
    private readonly IMessagesService _messagesService;
    private readonly IConversationsService _conversationsService;
    private readonly IHubContext<ConversationsHub, IConversationsClient> _hub;
    private readonly UsersController _usersController;

    public ConversationsController(IMessagesService messagesService, IConversationsService conversationsService, IHubContext<ConversationsHub, IConversationsClient> hub, UsersController usersController)
    {
        _messagesService = messagesService;
        _conversationsService = conversationsService;
        _hub = hub;
        _usersController = usersController;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MessageResponse>>> GetConversations()
    {
        var userAuthId = _usersController.GetCurrentUserAuthId();
        var response = await _conversationsService.GetAllByAuthIdAsync(userAuthId);
        
        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConversationResponse>> GetConversation(int id)
    {
       var response = await _conversationsService.GetByIdAsync(id);

       return response is null ? NotFound() : Ok(response);
    }

    // [HttpPost("{conversationId}/messages")]
    // [Authorize]
    // [ProducesResponseType(StatusCodes.Status201Created)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // public async Task<ActionResult<MessageResponse>> PostMessage(StandaloneMessageRequest request, int conversationId)
    // {
    //     var response = await _messagesService.PostAsync(request);

    //     if (response is null) {
    //         return BadRequest();
    //     }

    //     return CreatedAtAction("GetMessage", new { id = response.Id }, response);
    // }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ConversationResponse>> PostConversation(ConversationRequest request)
    {
        var response = await _conversationsService.PostAsync(request);

        if (response is null) {
            return BadRequest();
        }

        return CreatedAtAction("GetConversation", new { id = response.Id }, response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteConversationAsync(int id)
    {
        var conversation = await _conversationsService.DeleteByIdAsync(id);
        
        return conversation is null ? NotFound() : NoContent();
    }
}

