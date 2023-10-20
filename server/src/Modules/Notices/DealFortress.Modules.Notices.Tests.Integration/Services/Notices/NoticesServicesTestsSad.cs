using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Repositories;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsSad
{
    private readonly INoticesService _service;
    private readonly NoticeRequest _request;
    public NoticesFixture? Fixture;

    public NoticesServicesTestsSad()
    {
        _service = CreateNewService();

        _request = new NoticeRequest
        {
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" }
        };
    }

    public INoticesService CreateNewService()
    {
        Fixture?.Dispose();        

        Fixture = new NoticesFixture();

        var repo = new NoticesRepository(Fixture.Context);

        var productsService = new Mock<IProductsService>();

        return new NoticesService(productsService.Object, repo);
    }

    [Fact]
    public void GetById_returns_null_when_notice_is_not_found()
    {
        // Act
        var noticeResponses = _service.GetById(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }

    [Fact]
    public void PutById_returns_null_when_notice_is_not_found()
    {
        // Act
        var response = _service.PutById(-1, _request);

        // Assert
        response.Should().BeNull();
    }

    [Fact]
    public void DeleteById_returns_null_when_notice_is_not_found()
    {
        // Act
        var response = _service.DeleteById(-1);

        // Assert
        response.Should().BeNull();
    }
}