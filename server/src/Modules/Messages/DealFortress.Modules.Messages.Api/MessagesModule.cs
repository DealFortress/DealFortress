using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Notices.Extensions;
using DealFortress.Modules.Notices.Api.Controllers;
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
}
