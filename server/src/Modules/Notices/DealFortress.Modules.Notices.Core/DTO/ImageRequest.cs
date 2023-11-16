using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Notices.Core.DTO;
public class ImageRequest
{
    public required string Url { get; set; }
}