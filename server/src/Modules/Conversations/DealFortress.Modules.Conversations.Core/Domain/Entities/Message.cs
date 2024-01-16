
using System.ComponentModel.DataAnnotations;

namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class Message
{
    [Key]
    public int Id { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required Conversation Conversation { get; set; }
}
