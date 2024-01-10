
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


    public IEnumerable<ConversationResponse> GetAll()
    {
        return _repo.GetAll()
                    .Select(ToConversationResponseDTO)
                    .ToList();
    }

    public IEnumerable<ConversationResponse> GetAllByAuthId(string authId)
    {
        var id = _usersController.GetUserIdByAuthId(authId);

        return _repo.GetAll()
                    .Where(conversation => conversation.BuyerId == id || conversation.SellerId == id)
                    .Select(ToConversationResponseDTO)
                    .ToList();
    }

     public ConversationResponse? GetById(int id)
    {
        var conversation = _repo.GetById(id);

        if (conversation is null)
        {
            return null;
        }

        return ToConversationResponseDTO(conversation);
    } 

     public ConversationResponse Post(ConversationRequest request)
    {
        var conversation = ToConversation(request);

        _repo.Add(conversation);

        _repo.Complete();

        return ToConversationResponseDTO(conversation);
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
        return new Conversation()
        {
            NoticeId = request.NoticeId,
            Name = request.Name,
            BuyerId = request.BuyerId,
            SellerId = request.SellerId
        };
    }
}
