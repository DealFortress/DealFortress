using System.Security.Claims;
using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using DealFortress.Modules.Messages.Core.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Messages.Core.Domain.HubConfig;

[Authorize]
public sealed class MessageHub : Hub<IMessagesClient>
{
    private IMessagesService _service;

    public MessageHub(IMessagesService service) 
    {
        _service = service;
    }

    public override async Task OnConnectedAsync()
    {
        var authId = Context.User!.Identity!.Name!;
        await Clients.User(authId).SendJoinText($"{authId} has joined");

        var response = _service.GetAllByAuthId(authId);
        await Clients.User(authId).SendMessages(response);
    }
}
