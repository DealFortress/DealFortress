using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticeControllersTestsHappy
{
    private readonly NoticesController _controller;
    private readonly Mock<INoticesService> _service;
    private readonly NoticeRequest _request;
    private readonly NoticeResponse _response;

    private readonly Notice _notice;

    public NoticeControllersTestsHappy()
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
            UserId = 1,
            Title = "test title",
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
                    SoldStatus = SoldStatus.Available,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    ImageRequests = new List<ImageRequest>(){
                        new ImageRequest()
                        {
                            Url = "Hello world"
                        }
                    }
                }
            }
        };
    }

    public NoticeResponse CreateNoticeResponse()

    {
        return new NoticeResponse()
        {
            Id = 1,
            UserId = 1,
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
                    SoldStatus = SoldStatus.Available,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,

                    Images = new List<ImageResponse>(){
                        new ImageResponse()
                        {
                            Url = "Hello world"
                        }
                    },
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
            UserId = 1,
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
                    SoldStatus = SoldStatus.Available,
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
    public void GetNotices_should_return_ok()
    {
        // Arrange
        var content = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAll()).Returns(content);
        // Act
        var httpResponses = _controller.GetNotices();
        // Assert 
        httpResponses.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetNotices_return_list_of_response_when_server_returns_responses()
    {
        // Arrange
        var list = new List<NoticeResponse> { _response };
        _service.Setup(service => service.GetAll()).Returns(list);
        // Act
        var httpResponses = _controller.GetNotices();
        // Assert 
        var content = httpResponses.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<List<NoticeResponse>>();
    }
    [Fact]
    public void GetNotice_return_ok_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetNotice(1);
        // Assert 
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetNotice_return_response_when_server_returns_response()
    {
        // Arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);
        // Act
        var httpResponse = _controller.GetNotice(1);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public void PutNotice_returns_response_when_service_return_response()
    {
        // Arrange
        _service.Setup(service => service.PutById(1, _request)).Returns(_response);
        // Act
        var httpResponse = _controller.PutNotice(1, _request);
        // Assert 
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<NoticeResponse>();
    }
    [Fact]
    public void DeleteNotice_should_return_no_content()
    {
        // Arrange
        _service.Setup(service => service.DeleteById(1)).Returns(_notice);
        // Act
        var httpResponse = _controller.DeleteNotice(1);
        // Assert 
        httpResponse.Should().BeOfType<NoContentResult>();
    }
}