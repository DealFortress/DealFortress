using System.Runtime.CompilerServices;
using DealFortress.Modules.Users.Core.DAL;
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
                options.UseSqlServer(connectionString));
    }
}