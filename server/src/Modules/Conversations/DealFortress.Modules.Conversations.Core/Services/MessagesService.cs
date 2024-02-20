
using AutoMapper;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;



namespace DealFortress.Modules.Conversations.Core.Services;

public class MessagesService: IMessagesService
{
    private readonly IMessagesRepository _messagesRepo;
    private readonly UsersController _usersController;
    private readonly IConversationsRepository _conversationsRepo;
    private readonly IMapper _mapper;

    public MessagesService(IMessagesRepository messagesRepo, UsersController usersController, IConversationsRepository conversationsRepo, IMapper mapper)
    {
        _messagesRepo = messagesRepo;
        _usersController = usersController;
        _conversationsRepo = conversationsRepo;
        _mapper = mapper;
    }


    public async Task<IEnumerable<MessageResponse>> GetAllAsync()
    {
        var entities = await _messagesRepo.GetAllAsync();

        return _mapper.Map<IEnumerable<MessageResponse>>(entities);
                    
    }

    public async Task<IEnumerable<MessageResponse>> GetAllByAuthIdAsync(string authId)
    {
        var id = await _usersController.getUserIdByAuthIdAsync(authId);

        var entities = (await _messagesRepo.GetAllAsync())
            .Where(message => message.SenderId == id);

        return _mapper.Map<IEnumerable<MessageResponse>>(entities);
    }

     public async Task<MessageResponse?> GetByIdAsync(int id)
    {
        var entity = await _messagesRepo.GetByIdAsync(id);

        if (entity is null)
        {
            return null;
        }

        return  _mapper.Map<MessageResponse>(entity);;
    } 

     public async Task<MessageResponse?> PostAsync(StandaloneMessageRequest request, string? authId)
    {
        var isCreator = await _usersController.IsUserEntityCreatorAsync(request.SenderId, authId);

        if (!isCreator) 
        {
            return null;
        }

        var conversation = await _conversationsRepo.GetByIdAsync(request.ConversationId);

        if( conversation is null ) 
        {
            return null;
        }
        
        var entity =  _mapper.Map<Message>(request);;

        await _messagesRepo.AddAsync(entity);

        _messagesRepo.Complete();

        return  _mapper.Map<MessageResponse>(entity);
    }

}