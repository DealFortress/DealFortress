using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticeControllersTestsSad
{
    private readonly NoticesController _controller;
    private readonly Mock<INoticesService> _service;
    private readonly NoticeRequest _request;
    private readonly NoticeResponse _response;

    private readonly Notice _notice;

    public NoticeControllersTestsSad()
    {
        _service = new Mock<INoticesService>();

        _controller = new NoticesController(_service.Object);

        _request = CreateNoticeRequest();

        _response = CreateNoticeResponse();

        _notice = CreateNotice();
    }

    public NoticeRequest CreateNoticeRequest()
    {
        return new NoticeRequest()
        {
            Title = "test title",
            UserId = 1,
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" },
            ProductRequests = new List<ProductRequest>
            {
                new ProductRequest()
                {
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
                    IsSold = false,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New
                }
            }
        };
    }

    public NoticeResponse CreateNoticeResponse()

    {
        return new NoticeResponse()
        {
            Id = 1,
            UserId = "test userId",
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" },
            CreatedAt = new DateTime(),
            Products = new List<ProductResponse>
            {
                new ProductResponse()
                {
                    Id = 1,
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    CategoryName = "test category",
                    ImageUrls = new List<string>{"https://test"},
                    NoticeId = 1,
                }
            }
        };
    }

    public Notice CreateNotice()

    {
        return new Notice()
        {
            Id = 1,
            UserId = "test userId",
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = "cast,swish",
            DeliveryMethods = "mail,delivered",
            CreatedAt = new DateTime(),
            Products = new List<Product>
            {
                new Product()
                {
                    Id = 1,
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
                    IsSold = false,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    Notice = this._notice
                }
            }
        };
    }

    [Fact]
    public void getNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.GetById(1));

        // Act
        var httpResponse = _controller.GetNotice(1);

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void putNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.PutById(1, _request));

        // Act
        var httpResponse = _controller.PutNotice(1, _request);

        // Assert 
        httpResponse.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void deleteNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.DeleteById(1));

        // Act
        var httpResponse = _controller.DeleteNotice(1);

        // Assert 
        httpResponse.Should().BeOfType<NotFoundResult>();
    }


}