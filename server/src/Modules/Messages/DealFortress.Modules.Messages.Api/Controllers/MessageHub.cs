using DealFortress.Modules.Messages.Core.Domain.Clients;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Messages.Core.Domain.HubConfig;

public sealed class MessageHub : Hub<IMessagesClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");
    }

    public async Task SendMessage(string message)
    {
        await Clients.All.ReceiveMessage($"{Context.ConnectionId}: {message}");
    }
}
