using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Users.Core.DTO
{
    public class UserResponse
    {
        public required string Email { get; set; }
        public required string Username { get; set; }
        public required string Avatar { get; set; }
    }
}