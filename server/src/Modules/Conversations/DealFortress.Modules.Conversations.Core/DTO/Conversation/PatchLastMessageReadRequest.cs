using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.DTO.Conversation;
    public class PatchLastMessageReadRequest
    {
        public required int ConversationId { get; set; }
        public required int ReaderId { get; set; }
        public required int MessageId { get; set; }
    }
