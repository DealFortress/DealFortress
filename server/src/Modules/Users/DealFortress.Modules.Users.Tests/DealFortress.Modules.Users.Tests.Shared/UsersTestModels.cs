using System.Security.Claims;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Users.Tests.Shared;

public static class UsersTestModels
{
    public static UserRequest CreateUserRequest()
    {
        return new UserRequest()
        {
            AuthId = "testauthid123",
            Email = "testRequest@email.com",
            Username = "testRequestUsername",
            Avatar = "testRequestAvatar"
        };
    }

    public static UserResponse CreateUserResponse()

    {
        return new UserResponse()
        {
            Id = 1,
            Email = "testResponse@email.com",
            Username = "testResponseUsername",
            Avatar = "testResponseAvatar"
        };
    }

    public static User CreateUser()

    {
        return new User()
        {
            Id = 1,
            AuthId = "testauthid123",
            Email = "test@email.com",
            Username = "testUsername",
            Avatar = "testAvatar"
        };
    }

    public static ControllerBase CreateFakeClaims(this ControllerBase controller)
    {
        var fakeClaims = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, "authId"),
            new Claim("RoleId", "1"),
            new Claim("UserName", "John")
        };

        var fakeIdentity = new ClaimsIdentity(fakeClaims, "TestAuthType");
        var fakeClaimsPrincipal = new ClaimsPrincipal(fakeIdentity);

        controller.ControllerContext.HttpContext = new DefaultHttpContext
        {
            User = fakeClaimsPrincipal 
        };

        return controller;
    }
}
