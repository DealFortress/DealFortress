using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Messages.Extensions;
using DealFortress.Modules.Messages.Api.Controllers;
using DealFortress.Modules.Messages.Core.Domain.Clients;
using DealFortress.Modules.Messages.Core.Domain.HubConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Messages.Api;

internal static class Messages
{
    public static IServiceCollection AddMessagesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<MessagesController>()
            .AddSignalR();

        return services;
    }

    public static void MapMessageHub(this WebApplication app)
    {
        app.MapHub<MessageHub>("messages-hub");
    }
}
