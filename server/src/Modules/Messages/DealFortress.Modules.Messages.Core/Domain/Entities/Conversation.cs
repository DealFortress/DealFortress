
namespace DealFortress.Modules.Messages.Core.Domain.Entities;
public class Conversation {
    public int Id { get; set; }
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int UserOneId { get; set; }
    public required int UserTwoId { get; set; }
    public Message[]? Messages { get; set; }
}