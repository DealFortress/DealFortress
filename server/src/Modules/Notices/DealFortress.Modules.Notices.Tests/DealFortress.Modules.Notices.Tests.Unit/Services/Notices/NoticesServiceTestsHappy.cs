using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Tests.Shared;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticesServiceTestsHappy
{
    private readonly INoticesService _service;
    private readonly Mock<INoticesRepository> _repo;
    private readonly NoticeRequest _request;
    private readonly Notice _notice;

    public NoticesServiceTestsHappy()
    {
        _repo = new Mock<INoticesRepository>();

        var productsService = new Mock<IProductsService>();

        _service = new NoticesService(productsService.Object, _repo.Object);

        _request = NoticesTestModels.CreateNoticeRequest();

        _notice = NoticesTestModels.CreateNotice();

        _request = NoticesTestModels.CreateNoticeRequest();
    }

    [Fact]
    public void GetAll_returns_response()
    {
        // arrange
        var list = new List<Notice>() { _notice };
        _repo.Setup(repo => repo.GetAll()).Returns(list);

        // act
        var response = _service.GetAll();

        // assert
        response.Should().BeOfType<List<NoticeResponse>>();
    }

    [Fact]
    public void GetById_returns_response_when_repo_returns_a_notice()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeOfType<NoticeResponse>();
    }

    [Fact]
    public void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        _service.Post(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public void PutDTO_should_replace_data()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_complete_before_sending_back_DTO()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_return_response()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        var response = _service.PutById(1, _request);

        // Assert 
        response.Should().BeOfType<NoticeResponse>();
    }

    // [Fact]
    // public void PutDTO_should_return_images_inside_response()
    // {
    //    // arrange
    //     _repo.Setup(repo => repo.GetById(1)).Returns(_notice);
        

    //     // Act
    //     var response = _service.PutById(1, _request);

    //     // Assert 
    //     response?.Products?.First().Images?.Count().Should().Be(1); 
    // }

    [Fact]
    public void DeleteById_should_remove_data_and_complete()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        _service.DeleteById(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void DeleteById_should_return_Notice()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        var response = _service.DeleteById(1);

        // Assert 
        response.Should().Be(_notice);
    }
}