using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Users.Core.Domain.Entities
{
    public class User
    {
        [Key]
        public int Id { get; init; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public required string AuthId { get; init; }
        public required string Email { get; set; }
        public required string Username { get; set; }
        public required string Avatar { get; set; }
    }
}