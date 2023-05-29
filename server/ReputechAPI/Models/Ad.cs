
namespace ReputechAPI.Models
{
    public class Ad
    {
        [Key]
        public int Id { get; set; }
        public required string Product { get; set; }
        public required string Description { get; set; }
        public required int Price { get; set; }
        public required Delivery DeliveryMethod { get; set; } 
        public required Condition Condition { get; set; }
        public required string City { get; set; }
        public required bool Receipt { get; set; }
        public string Warranty { get; set; }
    }

    public enum Delivery 
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

    public enum Payment
    {
        Cash,
        Swish
    }
}