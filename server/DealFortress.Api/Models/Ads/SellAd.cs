using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models
{
    public class SellAd
    {
        [Key]
        public int Id { get; set; }
        public required string Product { get; set; }
        public required string Description { get; set; }
        public required int Price { get; set; }
        public required string City { get; set; }
        public required bool Receipt { get; set; }
        public required string Payment { get; set; }
        public string? Warranty { get; set; }
        public required Category Category {get; set; }
        public required Condition Condition { get; set; }
        public required DeliveryMethod DeliveryMethod { get; set; }
    }

    public enum DeliveryMethod
    {
        Mail,
        Pickup,
        HandDelivered
    }

    public enum Condition
    {
        New,
        LikeNew,
        Used,
        Modified,
        Defective,
        Broken
    }

    public enum PaymentMethod
    {

    }
}
