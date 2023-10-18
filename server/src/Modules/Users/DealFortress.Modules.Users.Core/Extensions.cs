using System.Runtime.CompilerServices;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Services;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Users.Api")]

namespace DealFortress.Modules.Users.Core.Extensions;
internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, string connectionString)
    {
        return services
            .AddScoped<IUsersRepository, UsersRepository>()
            .AddScoped<IUsersService, UsersService>();
    }
}