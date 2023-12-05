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
        await Clients.All.ReceiveMessages(_service.GetAll());
    }

    public async Task SendMessage(MessageResponse request)
    {
        await Clients.All.SendMessage(request);
    }

    public async Task GetMessages()
    {
        var response = _service.GetAll();
        await Clients.All.ReceiveMessages(response);
    }
}
