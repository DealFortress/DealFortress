using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;
using Microsoft.AspNetCore.Mvc;
using FluentAssertions;
using Moq;

namespace DealFortress.Modules.Users.Tests.Unit;

public class UsersControllersTestsHappy
{
    private readonly UsersController _controller;
    private readonly Mock<IUsersService> _service;
    private readonly UserRequest _request;
    private readonly UserResponse _response;
    private readonly User _users;

    public UsersControllersTestsHappy()
    {
        _service = new Mock<IUsersService>();

        _controller = new UsersController(_service.Object);

        _request = CreateUserRequest();

        _response = CreateUserResponse();

        _users = CreateUser();
    }

    public UserRequest CreateUserRequest()
    {
        return new UserRequest()
        {
            Email= "testRequest@email.com",
            Username="testRequestUsername",
            Avatar="testRequestAvatar"
        };
    }

    public UserResponse CreateUserResponse()

    {
        return new UserResponse()
        {
            Email= "testResponse@email.com",
            Username="testResponseUsername",
            Avatar="testResponseAvatar"
        };
    }

    public User CreateUser()

    {
        return new User()
        {
            Id=1,
            Email= "test@email.com",
            Username="testUsername",
            Avatar="testAvatar" 
        };
    }
    
    [Fact]
    public void GetUser_return_ok_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetUser(1);
        // Assert 
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetUser_return_response_when_server_returns_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetUser(1);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<UserResponse>();
    }

    // [Fact]
    // public void PutUser_return_no_content_when_service_return_response()
    // {
    //     // Arrange
    //     _service.Setup(service => service.PutById(1, _request)).Returns(_response);
    //     // Act
    //     var httpResponse = _controller.PutUsers(1, _request);
    //     // Assert 
    //     httpResponse.Should().BeOfType<NoContentResult>();
    // }
    // [Fact]
    // public void DeleteUser_should_return_no_content()
    // {
    //     // Arrange
    //     _service.Setup(service => service.DeleteById(1)).Returns(_Users);
    //     // Act
    //     var httpResponse = _controller.DeleteUser(1);
    //     // Assert 
    //     httpResponse.Should().BeOfType<NoContentResult>();
    // }
}