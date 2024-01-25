using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Users.Tests.Shared;
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
    private readonly UserResponse _response;

    public UsersControllersTestsHappy()
    {
        _service = new Mock<IUsersService>();

        _controller = new UsersController(_service.Object);

        _response = UsersTestModels.CreateUserResponse();
    }


 

    [Fact]
    public async void getUserByIdAsync_return_ok_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<UserResponse?>(_response));

        // Act
        var httpResponse = await _controller.getUserByIdAsync("1", "id");
        // Assert 
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task getUserByIdAsync_return_response_when_server_returns_responseAsync()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<UserResponse?>(_response));
        // Act
        var httpResponse = await _controller.getUserByIdAsync("1", "id");
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<UserResponse>();
    }
}