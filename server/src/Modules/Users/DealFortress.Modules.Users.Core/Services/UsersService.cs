using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;

namespace DealFortress.Modules.Users.Core.Services;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _repo;
    public UsersService(IUsersRepository repo)
    {
        _repo = repo;
    }

    public UserResponse? GetById(int id)
    {
        var user = _repo.GetById(id);

        if (user is null)
        {
            return null;
        }

        return ToUserResponseDTO(user);
    }

    public UserResponse? GetByAuthId(string authId)
    {
        var user = _repo.GetByAuthId(authId);

        if (user is null)
        {
            return null;
        }

        return ToUserResponseDTO(user);
    }
    public UserResponse Post(UserRequest request)
    {
        var user = ToUser(request);

        _repo.Add(user);

        _repo.Complete();

        return ToUserResponseDTO(user);
    }

    public UserResponse ToUserResponseDTO(User user)
    {
        var response = new UserResponse()
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Avatar = user.Avatar
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
            Avatar = request.Avatar
        };

        return user;
    }


}