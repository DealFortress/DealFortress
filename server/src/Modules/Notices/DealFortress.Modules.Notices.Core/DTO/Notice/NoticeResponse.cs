namespace DealFortress.Modules.Notices.Core.DTO;

    public class NoticeResponse
    {
        public required int Id { get; set; }
        public required int UserId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string City { get; set; }
        public required string[] Payments { get; set; }
        public required string[] DeliveryMethods { get; set; }
        public required DateTime CreatedAt { get; set; }
        public virtual IEnumerable<ProductResponse>? Products { get; set; }
    }

