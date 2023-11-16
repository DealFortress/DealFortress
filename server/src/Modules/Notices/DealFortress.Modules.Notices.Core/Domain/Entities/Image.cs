using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Notices.Core.Domain.Entities;

public class Image
{
    [Key]
    public int Id { get; set; }
    public required string Url { get; set; }
    public required Product Product { get; set; }
}