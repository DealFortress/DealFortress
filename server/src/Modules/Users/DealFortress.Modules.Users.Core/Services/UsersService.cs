using System.Security.Claims;
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
    public UsersService(IUsersRepository repo, IHttpContextAccessor httpContext)
    {
        _repo = repo;
        _httpContext = httpContext;
        
    }

    public async Task<UserResponse?> GetByIdAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);

        if (user is null)
        {
            return null;
        }

        return ToUserResponseDTO(user);
    }

    public async Task<UserResponse?> GetByAuthIdAsync(string authId)
    {
        var user = await _repo.GetByAuthIdAsync(authId);

        if (user is null)
        {
            return null;
        }

        return ToUserResponseDTO(user);
    }
    public async Task<UserResponse> PostAsync(UserRequest request)
    {
        var user = ToUser(request);

        await _repo.AddAsync(user);

        _repo.Complete();

        return ToUserResponseDTO(user);
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
    public UserResponse ToUserResponseDTO(User user)
    {
        var response = new UserResponse()
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Avatar = user.Avatar,
            CreatedAt = user.CreatedAt
        };

        return response;
    }

    public User ToUser(UserRequest request)
    {
        var user = new User()
        {
            AuthId = request.AuthId,
            Email = request.Email,
            Username = request.Username,
            Avatar = request.Avatar,
        };

        return user;
    }

}