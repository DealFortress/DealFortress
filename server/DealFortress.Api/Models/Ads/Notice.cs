using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Models
{
    public class Notice
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }

        public required string Payment { get; set; }
        public required DateTime CreatedAt { get; set; }
        public virtual List<Product>? Products { get; set; }
        public required string DeliveryMethod { get; set; }
    }

}
