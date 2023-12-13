
namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class ConversationResponse {
    public int Id { get; set; }
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int UserOneId { get; set; }
    public required int UserTwoId { get; set; }
    public List<Message>? Messages { get; set; }
}