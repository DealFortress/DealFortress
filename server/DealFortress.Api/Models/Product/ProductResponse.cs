
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
        public required List<int> ImageIds { get; set; }
        public required int NoticeId { get; set; }
        public required string NoticeCity { get; set; }
        public required string NoticePayment { get; set; }
        public required string NoticeDeliveryMethod { get; set; }
    }
}
