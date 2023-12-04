using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Messages.Extensions;
using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.HubConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Messages.Api;

internal static class Messages
{
    public static void AddMessagesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddSignalR();
    }

    public static void MapMessageHub(this WebApplication app)
    {
        app.MapHub<MessageHub>("messages-hub");
        app.MapPost("broadcast", async (string message, IHubContext<MessageHub, IMessagesClient> context) => 
        {
            await context.Clients.All.ReceiveMessage(message);

            return Results.NoContent();
        });
        
    }
}
