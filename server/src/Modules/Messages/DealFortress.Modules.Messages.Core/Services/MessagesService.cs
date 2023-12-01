using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.Domain.Repositories;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;

namespace DealFortress.Modules.Messages.Core.Services;

public class MessagesService: IMessagesService
{
    private readonly IMessagesRepository _repo;
    private UsersController _usersController;


    public MessagesService(IMessagesRepository repo, UsersController usersController)
    {
        _repo = repo;
        _usersController = usersController;
    }


    public IEnumerable<MessagesResponse> GetAll()
    {
        // FILTER BY USER ID
        return _repo.GetAll()
                    .Select(ToMessageResponseDTO)
                    .ToList();
    }

     public MessageResponse? GetById(int id)
    {
        var message = _repo.GetById(id);

        if (message is null)
        {
            return null;
        }

        return ToMessageResponseDTO(message);
    } 

     public MessageResponse Post(MessageRequest request)
    {
        var message = ToMessage(request);

        _repo.Add(message);

        _repo.Complete();

        return ToNoticeResponseDTO(message);
    }

    public MessageResponse ToMessageResponseDTO(Message message)
    {
        var response = new MessageResponse()
        {
        };

        return response;
    }

    public Message ToMessage(MessageRequest request)
    {
        return  new Message()
        {

        };
    }
}