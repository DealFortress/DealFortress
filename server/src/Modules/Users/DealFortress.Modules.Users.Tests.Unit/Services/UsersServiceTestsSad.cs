using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Moq;
using DealFortress.Modules.Users.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Modules.Users.Core.Domain.Services;

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
    public void GetById_returns_null_when_notice_is_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeNull();
    }

    // [Fact]
    // public void PutDTO_should_not_replace_data_if_user_not_found()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1));

    //     // Act
    //     _service.PutById(1, _request);

    //     // Assert 
    //     _repo.Verify(repo => repo.Add(It.IsAny<User>()), Times.Never());
    //     _repo.Verify(repo => repo.Remove(It.IsAny<User>()), Times.Never());
    // }

    // [Fact]
    // public void PutDTO_should_not_complete_if_user_not_found()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1));

    //     // Act
    //     _service.PutById(1, _request);

    //     // Assert 
    //     _repo.Verify(repo => repo.Complete(), Times.Never());
    // }

    // [Fact]
    // public void PutDTO_should_return_null_if_notice_not_found()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1));

    //     // Act
    //     var response = _service.PutById(1, _request);

    //     // Assert 
    //     response.Should().BeNull();
    // }

    // [Fact]
    // public void DeleteById_should_not_remove_data_and_complete_if_id_doesnt_exist()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1));

    //     // Act
    //     _service.DeleteById(1);

    //     // Assert 
    //     _repo.Verify(repo => repo.Remove(It.IsAny<User>()), Times.Never());
    //     _repo.Verify(repo => repo.Complete(), Times.Never());
    // }

    // [Fact]
    // public void DeleteById_should_not_return_User_if_id_doesnt_exist()
    // {
    //     // arrange
    //     _repo.Setup(repo => repo.GetById(1));

    //     // Act
    //     var response = _service.DeleteById(1);

    //     // Assert 
    //     response.Should().BeNull();
    // }
}