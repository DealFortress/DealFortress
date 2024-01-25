using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Tests.Shared;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class UsersControllersTestsSad
{
    private readonly UsersController _controller;
    private readonly Mock<IUsersService> _service;

    public UsersControllersTestsSad()
    {
        _service = new Mock<IUsersService>();

        _controller = new UsersController(_service.Object);

    }

    

    [Fact]
    public async Task getUserByIdAsync_returns_not_found_when_service_returns_nullAsync()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1));

        // Act
        var httpResponse = await _controller.getUserByIdAsync("1", " id");

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }

    }