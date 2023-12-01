using System.Runtime.CompilerServices;
using Microsoft.Extensions.DependencyInjection;
using DealFortress.Modules.Users.Core.Extensions;
using DealFortress.Modules.Users.Api.Controllers;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Users.Api;

internal static class UsersModule
{

    public static void AddUsersModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<UsersController>();
    }
}
