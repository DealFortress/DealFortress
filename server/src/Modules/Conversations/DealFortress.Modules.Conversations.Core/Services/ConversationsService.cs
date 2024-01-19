
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Repositories;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Users.Api.Controllers;

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

     public async Task<ConversationResponse> PostAsync(ConversationRequest request)
    {
        var conversation = ToConversation(request);

        await _repo.AddAsync(conversation);

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
