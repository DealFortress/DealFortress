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

public class UsersServicesTestsHappy
{
    private readonly IUsersService _service;
    private readonly UserRequest _request;
    public UsersFixture? Fixture;

    public UsersServicesTestsHappy()
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

        var httpContext = new Mock<IHttpContextAccessor>();

        var repo = new UsersRepository(Fixture.Context);

        return new UsersService(repo, httpContext.Object);
    }

    [Fact]
    public async Task GetById_should_return_the_notice_matching_idAsync()
    {
        // Act

        var noticeResponse = await _service.GetByIdAsync(1);

        // Assert 
        noticeResponse?.Username.Should().Be("User1");
        noticeResponse?.Id.Should().Be(1);
    }

    [Fact]
    public async Task Post_should_add_notice_in_dbAsync()
    {
        // Act
        var postResponse = await _service.PostAsync(_request);

        // Assert
        Fixture?.Context.Users.Find(postResponse?.Id)?.Username.Should().Be(_request.Username);
    }
}