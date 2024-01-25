using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Conversations.Extensions;
using DealFortress.Modules.Conversations.Api.Controllers;
using DealFortress.Modules.Conversations.Core.Domain.HubConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Conversations.Api;

internal static class ConversationsModule
{
    public static IServiceCollection AddConversationsModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<ConversationsController>()
            .AddSignalR();

        return services;
    }

    public static void MapConversationsHub(this WebApplication app)
    {
        app.MapHub<ConversationsHub>("conversations-hub");
    }
}
