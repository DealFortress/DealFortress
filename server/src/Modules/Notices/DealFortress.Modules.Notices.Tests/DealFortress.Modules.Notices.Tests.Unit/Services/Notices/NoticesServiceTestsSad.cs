using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Modules.Users.Api.Controllers;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticesServiceTestsSad
{
    private readonly INoticesService _service;
    private readonly Mock<INoticesRepository> _repo;
    private readonly NoticeRequest _request;
    private readonly Notice _notice;

    public NoticesServiceTestsSad()
    {
        _repo = new Mock<INoticesRepository>();

        _request = NoticesTestModels.CreateNoticeRequest();

        _notice = NoticesTestModels.CreateNotice();

        var productsService = new Mock<IProductsService>();
        var usersController = new Mock<UsersController>(null);

        _service = new NoticesService(productsService.Object, _repo.Object, usersController.Object);
    }

    [Fact]
    public async Task GetById_returns_null_when_notice_is_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().BeNull();
    }

    [Fact]
    public async Task PutDTO_should_not_replace_data_if_notice_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
    }

    [Fact]
    public async Task PutDTO_should_not_complete_if_notice_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public async Task PutDTO_should_return_null_if_notice_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        var response = await _service.PutByIdAsync(1, _request);

        // Assert 
        response.Should().BeNull();
    }

    [Fact]
    public async Task DeleteById_should_not_remove_data_and_complete_if_id_doesnt_existAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
       await _service.DeleteByIdAsync(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public async void DeleteById_should_not_return_Notice_if_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        var response = await _service.DeleteByIdAsync(1);

        // Assert 
        response.Should().BeNull();
    }

}