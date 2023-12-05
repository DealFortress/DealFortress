using System.Runtime.CompilerServices;
using Microsoft.Extensions.DependencyInjection;
using DealFortress.Modules.Users.Core.Extensions;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.CSharp.Syntax;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Users.Api;

internal static class UsersModule
{

    public static IServiceCollection AddUsersModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
            .AddScoped<UsersController>();

        return services;
    }
}
