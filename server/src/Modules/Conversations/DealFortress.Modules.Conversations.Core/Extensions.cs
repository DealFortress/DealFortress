using DealFortress.Modules.Conversations.Core.DAL;
using DealFortress.Modules.Conversations.Core.DAL.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.Services;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Abstractions.Automapper;

[assembly: InternalsVisibleTo("DealFortress.Modules.Conversations.Api")]

namespace DealFortress.Api.Modules.Conversations.Extensions;
internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection service, string connectionString)
    {
        return service
            .AddDbContext<ConversationsContext>(options =>
                options.UseSqlServer(connectionString))
            .AddScoped<IConversationsRepository, ConversationsRepository>()
            .AddScoped<IConversationsService, ConversationsService>()
            .AddScoped<IMessagesRepository, MessagesRepository>()
            .AddScoped<IMessagesService, MessagesService>()
            .AddAutoMapper(typeof(AutoMappingConversationProfiles).Assembly);
    }
}
