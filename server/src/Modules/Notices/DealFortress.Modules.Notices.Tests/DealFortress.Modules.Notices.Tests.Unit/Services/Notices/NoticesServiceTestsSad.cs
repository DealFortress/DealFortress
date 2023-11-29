using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Tests.Shared;

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

        var productsService = new Mock<IProductsService>();

        _service = new NoticesService(productsService.Object, _repo.Object);

        _request = NoticesTestModels.CreateNoticeRequest();

        _notice = NoticesTestModels.CreateNotice();

        _request = NoticesTestModels.CreateNoticeRequest();
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

    [Fact]
    public void PutDTO_should_not_replace_data_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
    }

    [Fact]
    public void PutDTO_should_not_complete_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public void PutDTO_should_return_null_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        var response = _service.PutById(1, _request);

        // Assert 
        response.Should().BeNull();
    }

    [Fact]
    public void DeleteById_should_not_remove_data_and_complete_if_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.DeleteById(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public void DeleteById_should_not_return_Notice_if_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        var response = _service.DeleteById(1);

        // Assert 
        response.Should().BeNull();
    }

}