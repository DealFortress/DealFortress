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

    

    public UserResponse ToUserResponseDTO(User user)
    {
        var response = new UserResponse()
        {
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
            Email = request.Email,
            Username = request.Username,
            Avatar = request.Avatar
        };

        return user;
    }


}