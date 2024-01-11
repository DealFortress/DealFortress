using System.Runtime;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.AspNetCore.Http.HttpResults;


namespace DealFortress.Modules.Conversations.Core.Services;

public class MessagesService: IMessagesService
{
    private readonly IMessagesRepository _repo;
    private readonly UsersController _usersController;

    private readonly IConversationsRepository _conversationsRepo;

    public MessagesService(IMessagesRepository repo, UsersController usersController, IConversationsRepository conversationsRepo)
    {
        _repo = repo;
        _usersController = usersController;
        _conversationsRepo = conversationsRepo;
    }


    public IEnumerable<MessageResponse> GetAll()
    {
        return _repo.GetAll()
                    .Select(ToMessageResponseDTO)
                    .ToList();
    }

    public IEnumerable<MessageResponse> GetAllByAuthId(string authId)
    {
        var id = _usersController.getLoggedInUserIdByAuthId(authId);

        return _repo.GetAll()
                    .Where(message => message.SenderId == id)
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

     public MessageResponse? Post(MessageRequest request)
    {
        var conversation = _conversationsRepo.GetById(request.ConversationId);

        if( conversation is null ) {
            return null;
        }
        var message = ToMessage(request, conversation);

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
            SenderId = message.SenderId, 
            CreatedAt = message.CreatedAt,
            ConversationId = message.Conversation.Id           
        };

        return response;
    }

    public Message ToMessage(MessageRequest request, Conversation conversation)
    {
        return new Message()
        {
            Text= request.Text,
            SenderId = request.SenderId, 
            CreatedAt = DateTime.UtcNow, 
            Conversation = conversation
        };
    }

}