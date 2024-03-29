using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Notices.Core.Domain.Entities;

    public class Notice
    {
        [Key]
        public int Id { get; set; }
        public required int UserId { get; set; }

        [StringLength(125, MinimumLength = 10 , ErrorMessage = "Title cannot be longer than 125 characters or less than 10 characters")]
        public required string Title { get; set; }

        [StringLength(500, MinimumLength = 30 , ErrorMessage = "Description cannot be longer than 500 characters or less than 30 characters")]
        public required string Description { get; set; }

        [StringLength(40, MinimumLength = 1 , ErrorMessage = "City cannot be longer than 40 characters or less than 1 characters")]
        public required string City { get; set; }
        
        [StringLength(50, MinimumLength = 4 , ErrorMessage = "Payments cannot be longer than 50 characters or less than 4 characters")]
        public required string Payments { get; set; }
        public required DateTime CreatedAt { get; set; }
        public virtual List<Product>? Products { get; set; }
        public required string DeliveryMethods { get; set; }
    }

