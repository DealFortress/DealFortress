using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using DealFortress.Modules.Messages.Core.Services;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Messages.Core.Domain.HubConfig;

public sealed class MessageHub : Hub<IMessagesClient>
{
    private IMessagesService _service;

    public MessageHub(IMessagesService service) 
    {
        _service = service;
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");
    }

    public async Task SendMessage(string message)
    {
        await Clients.All.ReceiveMessage($"{Context.ConnectionId}: {message}");
    }

    public async Task GetMessages()
    {
        var response = new List<MessageResponse>() { new MessageResponse() {Id = 1, RecipientId = 4, Text = "Hello", UserId = 1}};
        await Clients.All.ReceiveMessages(response);
    }
}
