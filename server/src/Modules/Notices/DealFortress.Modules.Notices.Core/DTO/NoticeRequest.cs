namespace DealFortress.Modules.Notices.Core.DTO;

    public class NoticeRequest
    {
        public required int UserId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }
        public required string[] Payments { get; set; }
        public required string[] DeliveryMethods { get; set; }
        public virtual List<ProductRequest>? ProductRequests { get; set; }
    }

