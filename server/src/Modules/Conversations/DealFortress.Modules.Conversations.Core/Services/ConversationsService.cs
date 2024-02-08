
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

    public ConversationsService(IConversationsRepository repo, UsersController usersController, IMessagesService messagesService)
    {
        _repo = repo;
        _usersController = usersController;
        _messagesService = messagesService;
    }


    public async Task<IEnumerable<ConversationResponse>> GetAllByAuthIdAsync(string authId)
    {
        var id = await _usersController.getUserIdByAuthIdAsync(authId);

        var entities = await _repo.GetAllAsync();

        return entities
                    .Where(conversation => conversation.BuyerId == id || conversation.SellerId == id)
                    .Select(ToConversationResponseDTO)
                    .ToList();
    }

     public async Task<ConversationResponse?> GetByIdAsync(int id)
    {
        var conversation = await _repo.GetByIdAsync(id);

        if (conversation is null)
        {
            return null;
        }

        return ToConversationResponseDTO(conversation);
    } 

    public async Task<ConversationResponse?> PostAsync(ConversationRequest request, string? authId)
    {
        var isCreator = await _usersController.IsUserEntityCreatorAsync(request.BuyerId, authId);

        if (!isCreator) 
        {
            return null;
        }

        var conversation = ToConversation(request);

        await _repo.AddAsync(conversation);

        _repo.Complete();

        return ToConversationResponseDTO(conversation);
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

        return ToConversationResponseDTO(conversation);
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

    public ConversationResponse ToConversationResponseDTO(Conversation conversation)
    {
        var response = new ConversationResponse()
        {
            Id = conversation.Id,
            NoticeId = conversation.NoticeId,
            Name = conversation.Name,
            BuyerId = conversation.BuyerId,
            SellerId = conversation.SellerId,
            BuyerLastReadMessageId = conversation.BuyerLastReadMessageId,
            SellerLastReadMessageId = conversation.SellerLastReadMessageId,
            Messages = conversation.Messages?.ConvertAll(message => _messagesService.ToMessageResponseDTO(message))
        };

        return response;
    }

    public Conversation ToConversation(ConversationRequest request)
    {
        var conversation = new Conversation()
        {
            NoticeId = request.NoticeId,
            Name = request.Name,
            BuyerId = request.BuyerId,
            SellerId = request.SellerId
        };

        if (request.MessageRequests is not null)
        {
            conversation.Messages = request.MessageRequests.ConvertAll(message => _messagesService.ToMessage(message, conversation));
        }

        return conversation;
    }
}
