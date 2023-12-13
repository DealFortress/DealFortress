
namespace DealFortress.Modules.Messages.Core.Domain.Entities;
public class ConversationResponse {
    public int Id { get; set; }
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int UserOneId { get; set; }
    public required int UserTwoId { get; set; }
    public required Message[] Messages { get; set; }
}