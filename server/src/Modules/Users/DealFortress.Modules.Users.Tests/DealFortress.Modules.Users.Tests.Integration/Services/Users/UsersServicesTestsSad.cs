using Moq;
using FluentAssertions;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using DealFortress.Modules.Users.Tests.Integration.Fixture;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
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
    public async void GetById_returns_null_when_notice_is_not_found()
    {
        // Act
        var noticeResponses = await _service.GetByIdAsync(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }
}