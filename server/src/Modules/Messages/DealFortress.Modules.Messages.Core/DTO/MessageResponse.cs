namespace DealFortress.Modules.Messages.Core.DTO
{
    public class MessageResponse
    {
        public required int Id { get; set; }
        public string? Text { get; set; }
        public string? Image { get; set; }
        public required int UserId { get; set; }
        public required int RecipientId { get; set; } 
    }
}