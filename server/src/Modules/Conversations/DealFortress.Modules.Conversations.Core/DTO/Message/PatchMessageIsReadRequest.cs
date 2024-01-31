
namespace DealFortress.Modules.Conversations.Core.DTO.Message;
public class PatchMessageIsReadRequest
{
public required int MessageId { get; set; }
public required int SenderId { get; set; }

}