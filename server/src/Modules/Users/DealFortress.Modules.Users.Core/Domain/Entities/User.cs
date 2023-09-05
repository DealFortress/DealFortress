using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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