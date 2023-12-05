using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.DTO;

namespace DealFortress.Modules.Messages.Core.Domain.Clients
{
    public interface IMessagesClient
    {
        Task ReceiveMessage(string message);

        Task ReceiveMessages(IEnumerable<MessageResponse> messages);
    }
}