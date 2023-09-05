using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Users.DealFortress.Modules.Users.Core.Domain.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Auth0Id { get; set; }
        public required string Username { get; set; }
        public required string Avatar { get; set; }
    }
}