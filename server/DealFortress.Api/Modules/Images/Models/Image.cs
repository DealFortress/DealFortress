using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models;

public class Image
{
    [Key]
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? Description { get; set; }
}
