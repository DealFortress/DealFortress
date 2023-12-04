using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Modules.Messages.Core.Domain.Clients
{
    public interface IMessagesClient
    {
        Task ReceiveMessage(string message);
    }
}