using DealFortress.Modules.Conversations.Core.Domain.Clients;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DealFortress.Modules.Conversations.Core.Domain.HubConfig;

[Authorize]
public sealed class ConversationsHub : Hub<IConversationsClient>
{
    private readonly IConversationsService _conversationService;
    private readonly IMessagesService _messagesService;
    private readonly UsersController _usersController;

    public ConversationsHub(IConversationsService conversationService, UsersController usersController, IMessagesService messagesService) 
    {
        _conversationService = conversationService;
        _usersController = usersController;
        _messagesService = messagesService;
    }

    public override async Task OnConnectedAsync()
    {
        var authId = Context.User!.Identity!.Name!;
        await Clients.User(authId).SendJoinText($"{authId} has joined");

        var response = await _conversationService.GetAllByAuthIdAsync(authId);
        await Clients.User(authId).GetConversations(response);
    }

    public async Task PostConversation(ConversationRequest request) 
    {
        var authId = Context.User!.Identity!.Name!;
        var isCreator = await _usersController.IsUserEntityCreatorAsync(request.BuyerId, authId);

        if (!isCreator) 
        {
            return;
        }

        var response = await _conversationService.PostAsync(request);

        if (response is null)
        {
            return;
        }

        var sellerAuthId = await _usersController.GetAuthIdByUserIdAsync(request.SellerId);

        await Clients.User(sellerAuthId!).GetConversation(response);
        await Clients.User(authId).GetConversation(response);
    }

    public async Task PostMessage(StandaloneMessageRequest request) 
    {
        var authId = Context.User!.Identity!.Name!;
        var isCreator = await _usersController.IsUserEntityCreatorAsync(request.SenderId, authId);

        if (!isCreator) 
        {
            return;
        }

        var response = await _messagesService.PostAsync(request);

        if (response is null)
        {
            return;
        }

        var conversation = await _conversationService.GetByIdAsync(response.ConversationId);

      
        var buyerAuthId = await _usersController.GetAuthIdByUserIdAsync(conversation!.BuyerId);
        var sellerAuthId = await _usersController.GetAuthIdByUserIdAsync(conversation!.SellerId);

        await Clients.User(buyerAuthId!).GetMessage(response);
        await Clients.User(sellerAuthId!).GetMessage(response);
    }

    // public async Task PatchMessageIsRead()
    // {
    //    var authId = Context.User!.Identity!.Name!;
    //     var isCreator = await _usersController.IsUserEntityCreatorAsync(request.SenderId, authId);

    //     if (!isCreator) 
    //     {
    //         return;
    //     }

    //     var response = await _messagesService.PatchAsync(request);

    //     if (response is null)
    //     {
    //         return;
    //     }

    //     var conversation = await _conversationService.GetByIdAsync(response.ConversationId);

      
    //     var buyerAuthId = await _usersController.GetAuthIdByUserIdAsync(conversation!.BuyerId);
    //     var sellerAuthId = await _usersController.GetAuthIdByUserIdAsync(conversation!.SellerId);

    //     await Clients.User(buyerAuthId!).GetMessage(response);
    //     await Clients.User(sellerAuthId!).GetMessage(response); 
    // }
}
