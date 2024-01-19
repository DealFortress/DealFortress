
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;



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


    public async Task<IEnumerable<MessageResponse>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();

        return entities
                    .Select(ToMessageResponseDTO)
                    .ToList();
    }

    public async Task<IEnumerable<MessageResponse>> GetAllByAuthIdAsync(string authId)
    {
        var id = await _usersController.getUserIdByAuthIdAsync(authId);

        var entity = await _repo.GetAllAsync();

        return entity
                    .Where(message => message.SenderId == id)
                    .Select(ToMessageResponseDTO)
                    .ToList();
    }

     public async Task<MessageResponse?> GetByIdAsync(int id)
    {
        var message = await _repo.GetByIdAsync(id);

        if (message is null)
        {
            return null;
        }

        return ToMessageResponseDTO(message);
    } 

     public async Task<MessageResponse?> PostAsync(StandaloneMessageRequest request)
    {

        var conversation = await _conversationsRepo.GetByIdAsync(request.ConversationId);

        if( conversation is null ) {
            return null;
        }
        
        var message = ToMessage(request, conversation);

        await _repo.AddAsync(message);

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

    public Message ToMessage(IMessageRequest request, Conversation conversation)
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