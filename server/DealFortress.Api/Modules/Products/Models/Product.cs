using System.ComponentModel.DataAnnotations;
using DealFortress.Api.Images;
using DealFortress.Api.Categories;
using DealFortress.Api.Notices;

namespace DealFortress.Api.Products;
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
