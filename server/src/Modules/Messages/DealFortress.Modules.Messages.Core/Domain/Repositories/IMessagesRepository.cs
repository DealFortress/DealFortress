using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Repositories;

namespace DealFortress.Modules.Messages.Core.Domain.Repositories;
public interface IMessagesRepository : IRepository<Message>
{

}
