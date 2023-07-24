namespace DealFortress.Api.Modules.Notices;

    public class ProductRequest
    {
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required bool HasReceipt { get; set; }
        public required bool IsSoldSeparately { get; set; }
        public string? Warranty { get; set; }
        public required int CategoryId { get; set; }
        public required Condition Condition { get; set; }
    }

