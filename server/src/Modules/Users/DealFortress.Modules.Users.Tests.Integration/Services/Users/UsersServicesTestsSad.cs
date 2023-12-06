using Moq;
using FluentAssertions;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using DealFortress.Modules.Users.Tests.Integration.Fixture;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using Microsoft.AspNetCore.Http;

namespace DealFortress.Modules.Users.Tests.Integration;

public class UsersServicesTestsSad
{
    private readonly IUsersService _service;
    private readonly UserRequest _request;
    public UsersFixture? Fixture;

    public UsersServicesTestsSad()
    {
        _service = CreateNewService();

        _request = new UserRequest()
        {
            AuthId = "testauthid123",
            Email = "testRequest@email.com",
            Username = "testRequestUsername",
            Avatar = "testRequestAvatar"
        };
    }

    public IUsersService CreateNewService()
    {
        Fixture?.Dispose();

        Fixture = new UsersFixture();

        var repo = new UsersRepository(Fixture.Context);

        var httpContext = new Mock<IHttpContextAccessor>();

        return new UsersService(repo, httpContext.Object);
    }

    [Fact]
    public void GetById_returns_null_when_notice_is_not_found()
    {
        // Act
        var noticeResponses = _service.GetById(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }

    // [Fact]
    // public void PutById_returns_null_when_product_is_not_found()
    // {
    //     // Act
    //     var response = _service.PutById(-1, _request);

    //     // Assert
    //     response.Should().BeNull();
    // }

    // [Fact]
    // public void DeleteById_returns_null_when_product_is_not_found()
    // {
    //     // Act
    //     var response = _service.DeleteById(-1);

    //     // Assert
    //     response.Should().BeNull();
    // }
}