using System.ComponentModel.DataAnnotations;

namespace DealFortress.Api.Models;

public class ImageRequest
{
    public required string Url { get; set; }
    public string? Description { get; set; }
}
