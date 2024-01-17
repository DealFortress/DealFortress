using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class UsersControllersTestsSad
{
    private readonly UsersController _controller;
    private readonly Mock<IUsersService> _service;
    private readonly UserRequest _request;
    private readonly UserResponse _response;
    private readonly User _user;

    public UsersControllersTestsSad()
    {
        _service = new Mock<IUsersService>();

        _controller = new UsersController(_service.Object);

        _request = CreateUserRequest();

        _response = CreateUserResponse();

        _user = CreateUser();
    }

    public UserRequest CreateUserRequest()
    {
        return new UserRequest()
        {
            AuthId = "testauthid123",
            Email = "testRequest@email.com",
            Username = "testRequestUsername",
            Avatar = "testRequestAvatar"
        };
    }

    public UserResponse CreateUserResponse()

    {
        return new UserResponse()
        {
            Id = 1,
            Email = "testResponse@email.com",
            Username = "testResponseUsername",
            Avatar = "testResponseAvatar"
        };
    }

    public User CreateUser()

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

    [Fact]
    public void getLoggedInUser_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.GetById(1));

        // Act
        var httpResponse = _controller.getLoggedInUser("1", " id");

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }

    // [Fact]
    // public void putUser_returns_not_found_when_service_returns_null()
    // {
    //     // Arrange
    //     _service.Setup(service => service.PutById(1, _request));

    //     // Act
    //     var httpResponse = _controller.PutUser(1, _request);

    //     // Assert 
    //     httpResponse.Should().BeOfType<NotFoundResult>();
    // }

    // [Fact]
    // public void deleteUser_returns_not_found_when_service_returns_null()
    // {
    //     // Arrange
    //     _service.Setup(service => service.DeleteById(1));

    //     // Act
    //     var httpResponse = _controller.DeleteUser(1);

    //     // Assert 
    //     httpResponse.Should().BeOfType<NotFoundResult>();
    // }


}