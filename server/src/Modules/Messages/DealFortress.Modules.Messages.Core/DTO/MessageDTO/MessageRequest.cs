
using DealFortress.Modules.Messages.Core.Domain.Entities;

namespace DealFortress.Modules.Messages.Core.DTO;
public class MessageRequest
{
    public required int ConversationId { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
}
