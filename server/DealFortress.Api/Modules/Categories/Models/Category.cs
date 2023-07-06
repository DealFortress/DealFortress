using System.ComponentModel.DataAnnotations;
using DealFortress.Api.Notices;

namespace DealFortress.Api.Categories;
public class Category
{
    [Key]
    public int Id { get; set; }
    public required string Name { get; set; }
}
