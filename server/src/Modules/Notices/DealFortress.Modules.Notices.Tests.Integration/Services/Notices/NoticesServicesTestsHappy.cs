using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Repositories;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class NoticesServicesTestsHappy : IClassFixture<NoticesFixture>
{
    private readonly INoticesService _service;
    private readonly INoticesRepository _repo;
    private readonly NoticeRequest _request;
    public NoticesFixture Fixture;

    public NoticesServicesTestsHappy(NoticesFixture fixture)
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
        var noticeResponses = _service.GetAllDTO();

        // Assert 
        noticeResponses.Count().Should().Be(2);
    }

    [Fact]
    public void GetDTOById_should_return_the_notice_matching_id()
    {
        // Act

        var noticeResponse = _service.GetDTOById(1);

        // Assert 
        noticeResponse?.Title.Should().Be("title 1");
        noticeResponse?.Id.Should().Be(1);
    }

    [Fact]
    public void PostDTO_should_add_notice_in_db()
    {
        // Act
        var postResponse = _service.PostDTO(_request);
        var noticeResponse = _service.GetDTOById(postResponse.Id);

        // Assert
        noticeResponse?.Title.Should().Be(_request.Title);
    }
    
    [Fact]
    public void PutDtoById_should_replace_notice_in_db()
    {
        // Arrange

        // Act
        var putResponse = _service.PutDTOById(1, _request);
        var noticeResponse = _service.GetDTOById(putResponse!.Id);
        // Assert
        noticeResponse?.Title.Should().Be(_request.Title);
    }
    

}