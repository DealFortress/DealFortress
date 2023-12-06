using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Moq;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using Microsoft.AspNetCore.Http;

namespace DealFortress.Modules.Users.Tests.Unit;

public class UsersServiceTestsSad
{
    private readonly IUsersService _service;
    private readonly Mock<IUsersRepository> _repo;
    private readonly UserRequest _request;
    private readonly User _user;

    public UsersServiceTestsSad()
    {
        _repo = new Mock<IUsersRepository>();

        var httpContext = new Mock<IHttpContextAccessor>();

        _service = new UsersService(_repo.Object, httpContext.Object);

        _request = CreateUserRequest();

        _user = CreateUser();

        _request = CreateUserRequest();
    }


    public UserRequest CreateUserRequest()
    {
        return new UserRequest()
        {
            AuthId = "testauthid123",
            Email= "testRequest@email.com",
            Username="testRequestUsername",
            Avatar="testRequestAvatar"
        };
    }

    public UserResponse CreateUserResponse()

    {
        return new UserResponse()
        {
            Id = 1,
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
            AuthId= "testauthid123",
            Email= "test@email.com",
            Username="testUsername",
            Avatar="testAvatar" 
        };
    }

    [Fact]
    public void GetById_returns_null_when_notice_is_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeNull();
    }
}