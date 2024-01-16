using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Repositories;

namespace DealFortress.Modules.Conversations.Core.Domain.Repositories
{
    public interface IConversationsRepository : IRepository<Conversation>
    {
        
    }
}