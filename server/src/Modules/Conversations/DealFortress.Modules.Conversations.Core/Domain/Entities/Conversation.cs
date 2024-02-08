
namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public class Conversation {
    public int Id { get; set; }
    public required int NoticeId { get; set; }
    public required string Name { get; set; }
    public required int BuyerId { get; set; }
    public required int SellerId { get; set; }
    public int? BuyerLastReadMessageId { get; set; }
    public int? SellerLastReadMessageId { get; set; }
    public virtual List<Message>? Messages { get; set; }
}