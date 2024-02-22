using FluentAssertions;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Moq;
using Microsoft.AspNetCore.Http;
using DealFortress.Modules.Users.Tests.Shared;
using AutoMapper;


namespace DealFortress.Modules.Users.Tests.Unit;

public class UsersServiceTestsHappy
{
    private readonly IUsersService _service;
    private readonly Mock<IUsersRepository> _repo;
    private readonly UserRequest _request;
    private readonly User _user;
    private readonly IMapper _mapper;


    public UsersServiceTestsHappy()
    {
        _repo = new Mock<IUsersRepository>();
        _mapper = UsersTestModels.CreateMapper(); 

        var httpContext = new Mock<IHttpContextAccessor>();

        _service = new UsersService(_repo.Object, httpContext.Object, _mapper);

        _request = UsersTestModels.CreateUserRequest();

        _user = UsersTestModels.CreateUser();
    }


   
    [Fact]
    public async Task GetById_returns_response_when_repo_returns_a_noticeAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<User?>(_user));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().BeOfType<UserResponse>();
    }

    [Fact]
    public async void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        await _service.PostAsync(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }
}