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
    public void GetById_should_return_the_notice_matching_id()
    {
        // Act

        var noticeResponse = _service.GetById(1);

        // Assert 
        noticeResponse?.Username.Should().Be("User1");
        noticeResponse?.Id.Should().Be(1);
    }

    [Fact]
    public void Post_should_add_notice_in_db()
    {
        // Act
        var postResponse = _service.Post(_request);

        // Assert
        Fixture?.Context.Users.Find(postResponse?.Id)?.Username.Should().Be(_request.Username);
    }

    // [Fact]
    // public void PutById_should_replace_notice_in_db()
    // {
    //     // Act
    //     var putResponse = _service.PutById(1, _request);

    //     // Assert
    //     Fixture?.Context.Users.Find(putResponse?.Id)?.Title.Should().Be(_request.Title);
    // }  

    // [Fact]
    // public void DeleteById_should_remove_notice_in_db()
    // {
    //     // Act
    //     _service.DeleteById(1);

    //     // Assert 
    //     Fixture?.Context.Users.Find(1).Should().BeNull();
    // }

}