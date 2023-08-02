using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Notices.Core.Domain.Entities;

    public class Notice
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }

        public required string Payments { get; set; }
        public required DateTime CreatedAt { get; set; }
        public virtual List<Product>? Products { get; set; }
        public required string DeliveryMethods { get; set; }
    }

