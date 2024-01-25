using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Moq;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using Microsoft.AspNetCore.Http;
using DealFortress.Modules.Users.Tests.Shared;

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

        _request = UsersTestModels.CreateUserRequest();

        _user = UsersTestModels.CreateUser();
    }


    [Fact]
    public async void GetById_returns_null_when_notice_is_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().BeNull();
    }
}