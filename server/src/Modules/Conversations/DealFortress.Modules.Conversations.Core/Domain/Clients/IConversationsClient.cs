using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;

namespace DealFortress.Modules.Conversations.Core.Domain.Clients;
public interface IConversationsClient
{
    Task SendJoinText(string message);
    Task GetConversations(IEnumerable<ConversationResponse> Conversations);
    Task PostConversation(ConversationResponse conversation);
    Task PostMessage(MessageResponse message);
}
