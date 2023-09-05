using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Users.Core.Domain.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public required string Email { get; set; }
        public required string Username { get; set; }
        public required string Avatar { get; set; }
    }
}