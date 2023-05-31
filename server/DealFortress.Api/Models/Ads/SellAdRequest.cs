
namespace DealFortress.Api.Models
{
    public class SellAdRequest
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }
        public required string Payment { get; set; }
        public virtual List<ProductRequest>? ProductRequests { get; set; }
        public required string DeliveryMethod { get; set; }
    }

}
