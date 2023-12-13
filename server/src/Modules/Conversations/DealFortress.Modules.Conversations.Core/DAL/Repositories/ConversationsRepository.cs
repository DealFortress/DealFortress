using System.Runtime.CompilerServices;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;

[assembly: InternalsVisibleTo("DealFortress.Modules.Conversations.Tests.Integration")]

namespace DealFortress.Modules.Conversations.Core.DAL.Repositories;

internal class ConversationsRepository : Repository<Conversation>, IConversationsRepository
{
    public ConversationsRepository(ConversationsContext context) : base(context)
    {}

    public ConversationsContext? ConversationsContext
    {
        get { return Context as ConversationsContext; }
    }
}
