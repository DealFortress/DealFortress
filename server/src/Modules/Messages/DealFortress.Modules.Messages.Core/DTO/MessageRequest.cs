
namespace DealFortress.Modules.Messages.Core.DTO
{
    public class MessageRequest
    {
        public string? Text { get; set; }
        public string? Image { get; set; }
        public required int RecipientId { get; set; }
    }
}