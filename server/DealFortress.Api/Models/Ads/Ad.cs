using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Models
{
    public abstract class Ad
    {
        [Key]
        public int Id { get; set; }
        public required string Product { get; set; }
        public required string Description { get; set; }
    }
}
