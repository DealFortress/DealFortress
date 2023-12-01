using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Tests.Integration")]

namespace DealFortress.Modules.Notices.Core.DAL.Repositories;

internal class MessagesRepository : Repository<Message>, IMessagesRepository
{
    public messagesRepository(MessagesContext context) : base(context)
    {}

    public MessagesContext? MessagesContext
    {
        get { return Context as MessagesContext; }
    }
}
