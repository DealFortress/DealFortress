
namespace DealFortress.Api.Models
{
    public class ProductResponse
    {
    public int Id { get; set; }
    public required string Name { get; set; }
    public required int Price { get; set; }
    public required bool Receipt { get; set; }
    public string? Warranty { get; set; }
    public required Category Category { get; set; }
    public required Condition Condition { get; set; }
    public required SellAd SellAd { get; set; }
    }
}
