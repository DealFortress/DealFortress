
namespace DealFortress.Api.Models
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required bool HasReceipt { get; set; }
        public string? Warranty { get; set; }

        public required int CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public required Condition Condition { get; set; }
        public required List<Image> Images { get; set; }
        public required int SellAdId { get; set; }
        public required string SellAdCity { get; set; }
        public required string SellAdPayment { get; set; }
        public required string SellAdDeliveryMethod { get; set; }
    }
}
