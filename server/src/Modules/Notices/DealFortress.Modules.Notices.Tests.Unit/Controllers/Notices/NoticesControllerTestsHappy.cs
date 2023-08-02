using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticeControllersTestsHappy
{
    private readonly NoticesController _controller;
    private readonly Mock<INoticesService> _service;
    private readonly NoticeRequest _request;
    private readonly NoticeResponse _response;

    public NoticeControllersTestsHappy()
    {
        _service = new Mock<INoticesService>();
        
        _controller = new NoticesController(_service.Object);

        _request = CreateNoticeRequest();

        _response = CreateNoticeResponse();
    }

    public NoticeRequest CreateNoticeRequest()
    {
        return new NoticeRequest()
        { 
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new []{"cast", "swish"},
            DeliveryMethods = new []{"mail", "delivered"},
            ProductRequests = new List<ProductRequest>
            {
                new ProductRequest()
                {
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
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
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new []{"cast", "swish"},
            DeliveryMethods = new []{"mail", "delivered"},
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

    [Fact]
    public void Test1()
    {

    }
}