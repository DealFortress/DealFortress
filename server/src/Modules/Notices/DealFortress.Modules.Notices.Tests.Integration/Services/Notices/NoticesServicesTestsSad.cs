using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Repositories;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsSad : IClassFixture<NoticesFixture>
{
    private readonly INoticesService _service;
    private readonly INoticesRepository _repo;
    private readonly NoticeRequest _request;
    public NoticesFixture Fixture;

    public NoticesServicesTestsSad(NoticesFixture fixture)
    {
        Fixture = fixture;
        Fixture.Initialize();

        _repo = new NoticesRepository(Fixture.Context);

        var productsService = new Mock<IProductsService>();

        _service = new NoticesService(productsService.Object, _repo);

        _request = new NoticeRequest
        {
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" }
        };
    }

    [Fact]
    public void GetAllDTO_should_return_all_notices()
    {
        // Act
        var noticeResponses = _service.GetDTOById(1);

        // Assert 
        noticeResponses.Should().Be(null);
    }
}