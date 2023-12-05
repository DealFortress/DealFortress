using System.Security.Claims;
using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using DealFortress.Modules.Messages.Core.Services;
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
        await Clients.User(authId).ReceiveMessage($"{authId} has joined");

        var response = _service.GetAll();
        await Clients.User(authId).ReceiveMessages(response);
    }

    public async Task SendMessage(MessageResponse request)
    {
        await Clients.All.SendMessage(request);
    }

    public async Task GetMessages()
    {
        var authId = Context.User!.Identity!.Name!;
        var response = _service.GetAll();
        await Clients.User(authId).ReceiveMessages(response);
    }
}
