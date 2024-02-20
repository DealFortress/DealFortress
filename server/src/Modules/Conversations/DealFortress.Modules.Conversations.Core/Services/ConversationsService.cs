
using AutoMapper;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO.Conversation;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace DealFortress.Modules.Conversations.Core.Services;
public class ConversationsService : IConversationsService
{
    private readonly IConversationsRepository _repo;
    private readonly UsersController _usersController;
    private readonly IMessagesService _messagesService;
    private readonly IMapper _mapper;

    public ConversationsService(IConversationsRepository repo, UsersController usersController, IMessagesService messagesService, IMapper mapper)
    {
        _repo = repo;
        _usersController = usersController;
        _messagesService = messagesService;
        _mapper = mapper;
    }


    public async Task<IEnumerable<ConversationResponse>> GetAllByAuthIdAsync(string authId)
    {
        var id = await _usersController.getUserIdByAuthIdAsync(authId);

        var entities = 
            (await _repo.GetAllAsync())
            .Where(conversation => conversation.BuyerId == id || conversation.SellerId == id);

        return _mapper.Map<IEnumerable<ConversationResponse>>(entities);
    }

     public async Task<ConversationResponse?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);

        if (entity is null)
        {
            return null;
        }

        return _mapper.Map<ConversationResponse>(entity);
    } 

    public async Task<ConversationResponse?> PostAsync(ConversationRequest request, string? authId)
    {
        var isCreator = await _usersController.IsUserEntityCreatorAsync(request.BuyerId, authId);

        if (!isCreator) 
        {
            return null;
        }

        var entity = _mapper.Map<Conversation>(request);

        await _repo.AddAsync(entity);

        _repo.Complete();

        return _mapper.Map<ConversationResponse>(entity);
    }

    public async Task<ConversationResponse?> PatchLastReadMessageAsync(PatchLastMessageReadRequest request, string authId)
    {
       var conversation = await _repo.GetByIdAsync(request.ConversationId);

        if (conversation is null || conversation.Messages is null )
        {
            return null;
        }

        var loggedInUserId = await _usersController.getUserIdByAuthIdAsync(authId);

        if (loggedInUserId != conversation.BuyerId && loggedInUserId != conversation.SellerId) 
        {
            return null;
        }

        var message = conversation.Messages.Find(message => message.Id == request.MessageId);

        if (message is null)
        {
            return null;
        }

        if (request.ReaderId == conversation.BuyerId) 
        {
            conversation.BuyerLastReadMessageId = message.Id;
        } 
        else if (request.ReaderId == conversation.SellerId) 
        {
            conversation.SellerLastReadMessageId = message.Id;
        }

        _repo.Update(conversation);
        _repo.Complete();

        return _mapper.Map<ConversationResponse>(conversation);
    }

    public async Task<Conversation?> DeleteByIdAsync(int id)
    {
        var conversation = await _repo.GetByIdAsync(id);

        if (conversation is null)
        {
            return null;
        }

        _repo.Remove(conversation);
        _repo.Complete();

        return conversation;
    }
}
