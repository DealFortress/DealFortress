namespace DealFortress.Modules.Conversations.Core.Domain.Entities;
public interface IMessageRequest
{
    string Text { get; set; }
    int SenderId { get; set; }
}
