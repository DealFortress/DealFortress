using System.Security.Claims;
using AutoMapper;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;
using Microsoft.AspNetCore.Http;

namespace DealFortress.Modules.Users.Core.Services;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _repo;
    private readonly IHttpContextAccessor _httpContext;
    private readonly IMapper _mapper;
    public UsersService(IUsersRepository repo, IHttpContextAccessor httpContext, IMapper mapper)
    {
        _repo = repo;
        _httpContext = httpContext;
        _mapper = mapper;
        
    }

    public async Task<UserResponse?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);

        if (entity is null)
        {
            return null;
        }

        return _mapper.Map<UserResponse>(entity);
    }

    public async Task<UserResponse?> GetByAuthIdAsync(string authId)
    {
        var entity = await _repo.GetByAuthIdAsync(authId);

        if (entity is null)
        {
            return null;
        }

        return _mapper.Map<UserResponse>(entity);
    }
    public async Task<UserResponse> PostAsync(UserRequest request)
    {
        var entity = _mapper.Map<User>(request);

        await _repo.AddAsync(entity);

        _repo.Complete();

        return _mapper.Map<UserResponse>(entity);
    }

    public string GetCurrentUserAuthId()
    {
        return _httpContext?.HttpContext?.User.Identity?.Name!;
    }

    public async Task<string?> GetAuthIdByUserIdAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);

        return user?.AuthId;
    }
}