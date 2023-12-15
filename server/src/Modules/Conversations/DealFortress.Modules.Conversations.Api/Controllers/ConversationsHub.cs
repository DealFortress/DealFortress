using System.Security.Claims;
using DealFortress.Modules.Conversations.Core.Domain.Clients;
using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.Domain.Services;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Conversations.Core.Services;
using DealFortress.Modules.Users.Api.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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

        var response = _conversationService.GetAllByAuthId(authId);
        await Clients.User(authId).GetConversations(response);
    }

    // public async Task GetConversations()
    // {
    //     var authId = Context.User!.Identity!.Name!;

    //     var response = _conversationService.GetAllByAuthId(authId);
    //     await Clients.User(authId).GetConversations(response);
    // }

    public async Task PostConversation(ConversationRequest request) 
    {
        var authId = Context.User!.Identity!.Name!;
        var isCreator = _usersController.IsUserEntityCreator(request.UserOneId, authId);

        if (!isCreator) 
        {
            return;
        }

        var response = _conversationService.Post(request);

        if (response is null)
        {
            return;
        }

        var recipientAuthId = _usersController.GetAuthIdByUserId(request.UserTwoId);

        await Clients.User(recipientAuthId!).GetConversation(response);
        await Clients.User(authId).GetConversation(response);
    }

    public async Task PostMessage(MessageRequest request) 
    {
        var authId = Context.User!.Identity!.Name!;
        var isCreator = _usersController.IsUserEntityCreator(request.SenderId, authId);

        if (!isCreator) 
        {
            return;
        }

        var response = _messagesService.Post(request);

        if (response is null)
        {
            return;
        }

        var conversation = _conversationService.GetById(request.ConversationId);
        var userOneAuthId = _usersController.GetAuthIdByUserId(conversation!.UserOneId);
        var userTwoAuthId = _usersController.GetAuthIdByUserId(conversation!.UserTwoId);

        await Clients.User(userOneAuthId!).GetMessage(response);
        await Clients.User(userTwoAuthId!).GetMessage(response);
    }
}
