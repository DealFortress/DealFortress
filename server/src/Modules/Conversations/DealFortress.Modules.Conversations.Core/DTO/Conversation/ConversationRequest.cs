
using DealFortress.Modules.Conversations.Core.DTO;

namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class ConversationRequest {
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int BuyerId { get; set; }
    public required int SellerId { get; set; }
    public List<NestedMessageRequest>? MessagesRequests { get; set; }
}