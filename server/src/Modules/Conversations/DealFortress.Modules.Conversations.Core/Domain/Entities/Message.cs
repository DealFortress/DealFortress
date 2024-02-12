
using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class Message
{
    [Key]
    public int Id { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public required Conversation Conversation { get; set; }
    public  bool IsRead { get; set; } = false;
}
