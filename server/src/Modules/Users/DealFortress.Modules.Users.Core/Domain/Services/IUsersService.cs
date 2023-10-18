using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.DTO;

namespace DealFortress.Modules.Users.Core.Domain.Services;

public interface IUsersService
{
    UserResponse ToUserResponseDTO(User user);

    User ToUser(UserRequest request);
}