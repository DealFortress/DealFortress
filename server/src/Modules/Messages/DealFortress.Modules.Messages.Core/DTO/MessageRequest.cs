
namespace DealFortress.Modules.Messages.Core.DTO;
public class MessageRequest
{
    public required string Text { get; set; }
    public required int UserId { get; set; }
    public required int RecipientId { get; set; }
}
