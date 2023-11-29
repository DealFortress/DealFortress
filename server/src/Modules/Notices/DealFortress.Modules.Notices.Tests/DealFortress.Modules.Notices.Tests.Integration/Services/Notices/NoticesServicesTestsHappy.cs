using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using Microsoft.Build.Framework;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsHappy
{
    private readonly INoticesService _service;
    private readonly NoticeRequest _request;
    private Mock<IProductsService>? _productsService;
    public NoticesFixture? Fixture;

    public NoticesServicesTestsHappy()
    {
        _service = CreateNewService();

        _request = NoticesTestModels.CreateNoticeRequest();
    }

    public INoticesService CreateNewService()
    {
        Fixture?.Dispose();

        Fixture = new NoticesFixture();

        var repo = new NoticesRepository(Fixture.Context);

        _productsService = new Mock<IProductsService>();

        return new NoticesService(_productsService.Object, repo);
    }

    [Fact]
    public void GetAll_should_return_all_notices()
    {
        // Act
        var noticeResponses = _service.GetAll();

        // Assert 
        noticeResponses.Count().Should().Be(2);
    }

    [Fact]
    public void GetById_should_return_the_notice_matching_id()
    {
        // Act

        var noticeResponse = _service.GetById(1);

        // Assert 
        noticeResponse?.Title.Should().Be("title 1");
        noticeResponse?.Id.Should().Be(1);
    }

    [Fact]
    public void Post_should_add_notice_in_db()
    {
        // Arrange
        var product = NoticesTestModels.CreateNotice().Products!.First();
        _productsService?.Setup(service => service.ToProduct(It.IsAny<ProductRequest>(), It.IsAny<Notice>())).Returns(product);

        // Act
        var postResponse = _service.Post(_request);

        // Assert
        Fixture?.Context.Notices.Find(postResponse?.Id)?.Title.Should().Be(_request.Title);
    }

    [Fact]
    public void PutById_should_replace_notice_in_db()
    {
        // Arrange
        var product = NoticesTestModels.CreateNotice().Products!.First();
        _productsService?.Setup(service => service.ToProduct(It.IsAny<ProductRequest>(), It.IsAny<Notice>())).Returns(product);

        // Act
        var putResponse = _service.PutById(1, _request);

        // Assert
        Fixture?.Context.Notices.Find(putResponse?.Id)?.Title.Should().Be(_request.Title);
    }

    [Fact]
    public void DeleteById_should_remove_notice_in_db()
    {
        // Act
        _service.DeleteById(1);

        // Assert 
        Fixture?.Context.Notices.Find(1).Should().BeNull();
    }

}