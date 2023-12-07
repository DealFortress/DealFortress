using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.Domain.Repositories;
using DealFortress.Modules.Messages.Core.Domain.Services;
using DealFortress.Modules.Messages.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;


namespace DealFortress.Modules.Messages.Core.Services;

public class MessagesService: IMessagesService
{
    private readonly IMessagesRepository _repo;
    private readonly UsersController _usersController;

    public MessagesService(IMessagesRepository repo, UsersController usersController)
    {
        _repo = repo;
        _usersController = usersController;
    }


    public IEnumerable<MessageResponse> GetAll()
    {
        return _repo.GetAll()
                    .Select(ToMessageResponseDTO)
                    .ToList();
    }

    public IEnumerable<MessageResponse> GetAllByAuthId(string authId)
    {
        var id = _usersController.GetUserIdByAuthId(authId);

        return _repo.GetAll()
                    .Where(message => message.UserId == id || message.RecipientId == id)
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

        return ToMessageResponseDTO(message);
    }

    public MessageResponse ToMessageResponseDTO(Message message)
    {
        var response = new MessageResponse()
        {
            Id = message.Id,
            Text= message.Text,
            UserId = message.UserId,
            RecipientId = message.RecipientId            
        };

        return response;
    }

    public Message ToMessage(MessageRequest request)
    {
        return new Message()
        {
            Text= request.Text,
            UserId = request.UserId,
            RecipientId = request.RecipientId    
        };
    }

}