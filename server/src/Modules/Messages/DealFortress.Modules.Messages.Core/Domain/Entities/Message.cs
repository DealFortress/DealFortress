
using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Messages.Core.Domain.Entities
{
    public class Message
    {
        [Key]
        public required int Id { get; set; }
        public string? Text { get; set; }
        public string? Image { get; set; }
        public required int UserId { get; set; }
        public required int RecipientId { get; set; }
    }
}