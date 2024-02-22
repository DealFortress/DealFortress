using Moq;
using FluentAssertions;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using DealFortress.Modules.Users.Tests.Integration.Fixture;
using DealFortress.Modules.Users.Core.DAL.Repositories;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using DealFortress.Modules.Users.Tests.Shared;

namespace DealFortress.Modules.Users.Tests.Integration;

public class UsersServicesTestsHappy
{
    private readonly IUsersService _service;
    private readonly UserRequest _request;
    public UsersFixture? Fixture;
    private readonly IMapper _mapper;


    public UsersServicesTestsHappy()
    {
        _mapper = UsersTestModels.CreateMapper(); 
        _service = CreateNewService(_mapper);
        _request = UsersTestModels.CreateUserRequest();
    }

    public IUsersService CreateNewService(IMapper mapper)
    {
        Fixture?.Dispose();

        Fixture = new UsersFixture();

        var httpContext = new Mock<IHttpContextAccessor>();

        var repo = new UsersRepository(Fixture.Context);

        return new UsersService(repo, httpContext.Object, mapper);
    }

    [Fact]
    public async Task GetById_should_return_the_user_matching_idAsync()
    {
        // Act

        var userResponse = await _service.GetByIdAsync(1);

        // Assert 
        userResponse?.Username.Should().Be("User1");
        userResponse?.Id.Should().Be(1);
    }

    [Fact]
    public async Task Post_should_add_user_in_dbAsync()
    {
        // Act
        var postResponse = await _service.PostAsync(_request);

        // Assert
        Fixture?.Context.Users.Find(postResponse?.Id)?.Username.Should().Be(_request.Username);
    }
}