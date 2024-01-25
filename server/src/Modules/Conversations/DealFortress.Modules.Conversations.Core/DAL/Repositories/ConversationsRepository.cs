using System.Runtime.CompilerServices;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

[assembly: InternalsVisibleTo("DealFortress.Modules.Conversations.Tests.Integration")]

namespace DealFortress.Modules.Conversations.Core.DAL.Repositories;

internal class ConversationsRepository : Repository<Conversation>, IConversationsRepository
{
    public ConversationsRepository(ConversationsContext context) : base(context)
    {}

    public new async Task<IEnumerable<Conversation>> GetAllAsync()
    {
        return await ConversationsContext!.Conversations
                    .Include(conversation => conversation.Messages)
                    .ToListAsync();
    }

    public new async Task<Conversation?> GetByIdAsync(int id)
    {
        return await ConversationsContext!.Conversations
                    .Include(conversation => conversation.Messages)
                    .FirstOrDefaultAsync(conversation => conversation.Id == id);
    }

    public ConversationsContext? ConversationsContext
    {
        get { return Context as ConversationsContext; }
    }

}
