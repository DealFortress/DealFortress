using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Modules.Messages.Core.Domain.Services
{
    public interface IMessagesService
    {
    IEnumerable<MessagesResponse> GetAll();

    MessageResponse? GetById(int id);

    MessageResponse Post(MessageRequest request);

    MessageResponse? PutById(int id, MessageRequest request);

    Message? DeleteById(int id);

    MessageResponse ToMessageResponseDTO(Message message);

    Message ToMessage(MessageRequest request); 
    }
}