
using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Messages.Core.Domain.Entities
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        public required string Text { get; set; }
        public required int UserId { get; set; }
        public required int RecipientId { get; set; }
    }
}