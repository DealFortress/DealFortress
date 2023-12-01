using DealFortress.Modules.Messages.Core.DAL;
using DealFortress.Modules.Messages.Core.DAL.Repositories;
using DealFortress.Modules.Messages.Core.Domain.Repositories;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.Services;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Messages.Api")]

namespace DealFortress.Api.Modules.Messages.Extensions
{
    internal static class Extensions
    {
        public static IServiceCollection AddCore(this IServiceCollection service, string connectionString)
        {
            return service
                .AddDbContext<messagesContext>(options =>
                    options.UseSqlServer(connectionString))
                .AddScoped<IMessagesRepository, MessagesRepository>()
                .AddScoped<IMessagesService, MessagesService>()
        }
    }
}