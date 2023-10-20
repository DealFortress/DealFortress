using FluentAssertions;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Moq;

namespace DealFortress.Modules.Users.Tests.Unit;

public class UsersServiceTestsHappy
{
    private readonly IUsersService _service;
    private readonly Mock<IUsersRepository> _repo;
    private readonly UserRequest _request;
    private readonly User _user;

    public UsersServiceTestsHappy()
    {
        _repo = new Mock<IUsersRepository>();

        _service = new UsersService(_repo.Object);

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
    public void GetById_returns_response_when_repo_returns_a_notice()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_user);

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeOfType<UserResponse>();
    }

    [Fact]
    public void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        _service.Post(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    // [Fact]
    // public void PutDTO_should_replace_data()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_user);

    //     // Act
    //     _service.PutById(1, _request);

    //     // Assert 
    //     _repo.Verify(repo => repo.Add(It.IsAny<Notice>()), Times.AtLeastOnce());
    //     _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
    // }

    // [Fact]
    // public void PutDTO_should_complete_before_sending_back_DTO()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_user);

    //     // Act
    //     _service.PutById(1, _request);

    //     // Assert 
    //     _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    // }

    // [Fact]
    // public void PutDTO_should_return_response()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_user);

    //     // Act
    //     var response = _service.PutById(1, _request);

    //     // Assert 
    //     response.Should().BeOfType<NoticeResponse>();
    // }

    // [Fact]
    // public void DeleteById_should_remove_data_and_complete()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_user);

    //     // Act
    //     _service.DeleteById(1);

    //     // Assert 
    //     _repo.Verify(repo => repo.Remove(It.IsAny<User>()), Times.AtLeastOnce());
    //     _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    // }

    // [Fact]
    // public void DeleteById_should_return_User()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_user);

    //     // Act
    //     var response = _service.DeleteById(1);

    //     // Assert 
    //     response.Should().Be(_user;
    // }
}