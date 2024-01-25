using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Conversations.Tests.Integration")]

namespace DealFortress.Modules.Conversations.Core.DAL.Repositories;

internal class MessagesRepository : Repository<Message>, IMessagesRepository
{
    public MessagesRepository(ConversationsContext context) : base(context)
    {}

    public ConversationsContext? ConversationsContext
    {
        get { return Context as ConversationsContext; }
    }
}
