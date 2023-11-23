using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Notices.Core.Domain.Entities;

public class Product
{
    [Key]
    public int Id { get; set; }
    
    [StringLength(50, MinimumLength = 2 , ErrorMessage = "Name cannot be longer than 50 characters or less than 2 characters")]
    public required string Name { get; set; }

    [Range(0, 100000, ErrorMessage = "The maximum price for a product is 100 000 SEK")]
    public required int Price { get; set; }
    public required bool HasReceipt { get; set; }
    public required bool IsSold { get; set; }
    public required bool IsSoldSeparately { get; set; }
    public required int CategoryId { get; set; }
    public virtual List<Image>? Images { get; set; }
    public required Condition Condition { get; set; }
    public required Notice Notice { get; set; }
    public string? Warranty { get; set; }
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
