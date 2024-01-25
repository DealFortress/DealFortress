using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.DTO;

namespace DealFortress.Modules.Users.Core.Domain.Services;

public interface IUsersService
{

    Task<UserResponse?> GetByIdAsync(int id);

    Task<UserResponse?> GetByAuthIdAsync(string authId);

    string GetCurrentUserAuthId();

    Task<string?> GetAuthIdByUserIdAsync(int id);

    Task<UserResponse> PostAsync(UserRequest request);

    UserResponse ToUserResponseDTO(User user);

    User ToUser(UserRequest request);
}