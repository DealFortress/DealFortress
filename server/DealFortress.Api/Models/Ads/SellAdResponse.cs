namespace DealFortress.Api.Models
{
    public class SellAdResponse
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }
        public required string Payment { get; set; }
        public required string DeliveryMethod { get; set; }
        public required DateTime CreatedAt { get; set; }
        public virtual List<ProductResponse>? Products { get; set; }
    }

}
