using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models;
public class Product
{
    [Key]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required int Price { get; set; }
    public required bool HasReceipt { get; set; }
    public string? Warranty { get; set; }
    public required bool IsSold { get; set; }
    public required bool IsSoldSeparately { get; set; }
    public required List<Image> Images { get; set; }
    public required Category Category { get; set; }
    public required Condition Condition { get; set; }
    public required Notice Notice { get; set; }
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
