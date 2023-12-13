using System.Security.Claims;
using DealFortress.Modules.Conversations.Core.Domain.Clients;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Conversations.Core.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Conversations.Core.Domain.HubConfig;

[Authorize]
public sealed class ConversationsHub : Hub<IConversationsClient>
{
    private IConversationsService _service;

    public ConversationsHub(IConversationsService service) 
    {
        _service = service;
    }

    public override async Task OnConnectedAsync()
    {
        var authId = Context.User!.Identity!.Name!;
        await Clients.User(authId).SendJoinText($"{authId} has joined");

        var response = _service.GetAllByAuthId(authId);
        await Clients.User(authId).GetConversations(response);
    }
}
