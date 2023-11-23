using System.ComponentModel.DataAnnotations;

using DealFortress.Modules.Notices.Core.Domain.Entities;

namespace DealFortress.Modules.Notices.Core.DTO;

    public class ProductRequest
    {
        [StringLength(50, MinimumLength = 2 , ErrorMessage = "Name cannot be longer than 50 characters or less than 2 characters")]
        public required string Name { get; set; }

        [Range(1, 100000, ErrorMessage = "Price must be between 1SEK and 100 000SEK")]
        public required int Price { get; set; }
        public required bool HasReceipt { get; set; }
        public required bool IsSold { get; set; }
        public required bool IsSoldSeparately { get; set; }
        public string? Warranty { get; set; }
        public required int CategoryId { get; set; }
        public required Condition Condition { get; set; }
        public required List<ImageRequest> ImageRequests { get; set; }
    }

