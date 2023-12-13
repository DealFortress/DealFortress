
namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class ConversationRequest {
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int UserOneId { get; set; }
    public required int UserTwoId { get; set; }
    public required List<Message> Messages { get; set; }
}