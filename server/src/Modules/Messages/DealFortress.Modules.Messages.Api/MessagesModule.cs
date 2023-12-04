using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Messages.Extensions;
using DealFortress.Modules.Messages.Api.Controllers;
using DealFortress.Modules.Messages.Core.Domain.HubConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Messages.Api;

internal static class Messages
{
    public static void AddMessagesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<MessagesController>()
            .AddSignalR();
    }

    public static void MapMessageHub(this WebApplication app)
    {
        // app.UseEndpoints(endpoints =>
        // {
        //     endpoints.MapHub<MessageHub>("/messages");
        // });

        app.MapHub<MessageHub>("/messages");
    }
}
