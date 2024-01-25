using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.DTO;
public class NestedMessageRequest : IMessageRequest
{
    public string? Text { get; set; }
    public int SenderId { get; set; }
}
