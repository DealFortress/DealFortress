using System.ComponentModel.DataAnnotations;
using DealFortress.Api.Products;

namespace DealFortress.Api.Categories;
public class Category
{
    [Key]
    public int Id { get; set; }
    public required string Name { get; set; }
}
