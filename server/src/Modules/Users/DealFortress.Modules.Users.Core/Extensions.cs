using System.Runtime.CompilerServices;
using Abstractions.Automapper;
using DealFortress.Modules.Users.Core.DAL;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Users.Api")]

namespace DealFortress.Modules.Users.Core.Extensions;
internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, string connectionString)
    {
        return services
            .AddDbContext<UsersContext>(options =>
                options.UseSqlServer(connectionString))
            .AddScoped<IUsersService, UsersService>()
            .AddScoped<IUsersRepository, UsersRepository>()
            .AddAutoMapper(typeof(AutoMappingUserProfiles));
    }
}