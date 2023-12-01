using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Messages.Tests.Integration")]

namespace DealFortress.Modules.Messages.Core.DAL.Repositories;

internal class MessagesRepository : Repository<Message>, IMessagesRepository
{
    public MessagesRepository(MessagesContext context) : base(context)
    {}

    public MessagesContext? MessagesContext
    {
        get { return Context as MessagesContext; }
    }
}
