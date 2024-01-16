using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Users.Tests.Integration")]

namespace DealFortress.Modules.Users.Core.DAL.Repositories;

internal class UsersRepository : Repository<User>, IUsersRepository
{
    public UsersRepository(UsersContext context) : base(context)
    {}

    public async Task<User?> GetByAuthIdAsync(string authId)
    {
        return await UsersContext!.Users.FirstOrDefaultAsync(user => user.AuthId == authId);
    }

    public UsersContext? UsersContext
    {
        get { return Context as UsersContext; }
    }
}
