using Moq;
using FluentAssertions;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using DealFortress.Modules.Users.Tests.Integration.Fixture;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using DealFortress.Modules.Users.Tests.Shared;

namespace DealFortress.Modules.Users.Tests.Integration;

public class UsersServicesTestsSad
{
    private readonly IUsersService _service;
    private readonly UserRequest _request;
    public UsersFixture? Fixture;
    private readonly IMapper _mapper;


    public UsersServicesTestsSad()
    {
        _mapper = UsersTestModels.CreateMapper(); 
        _service = CreateNewService(_mapper);
        _request = UsersTestModels.CreateUserRequest();
    }

    public IUsersService CreateNewService(IMapper mapper)
    {
        Fixture?.Dispose();

        Fixture = new UsersFixture();

        var repo = new UsersRepository(Fixture.Context);

        var httpContext = new Mock<IHttpContextAccessor>();

        return new UsersService(repo, httpContext.Object, mapper);
    }

    [Fact]
    public async void GetById_returns_null_when_user_is_not_found()
    {
        // Act
        var userResponses = await _service.GetByIdAsync(-1);

        // Assert 
        userResponses.Should().Be(null);
    }
}