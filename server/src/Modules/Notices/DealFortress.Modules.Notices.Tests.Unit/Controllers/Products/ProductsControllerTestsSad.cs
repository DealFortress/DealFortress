using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductControllersTestsSad
{
    private readonly ProductsController _controller;
    private readonly Mock<IProductsService> _service;
    private readonly ProductRequest _request;
    private readonly ProductResponse _response;
    private readonly Product _Product;

    public ProductControllersTestsSad
()
    {
        _service = new Mock<IProductsService>();

        _controller = new ProductsController(_service.Object);

        _request = CreateProductRequest();

        _response = CreateProductResponse();

        _Product = CreateProduct();
    }

    public ProductRequest CreateProductRequest()
    {
        return new ProductRequest
        {
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSold = false,
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
        };
    }

    public ProductResponse CreateProductResponse()
    {
        return new ProductResponse()
        {
            Id = 1,
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSoldSeparately = false,
            IsSold = false,
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
        };
    }

    public Product CreateProduct()
    {
        return new Product()
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
            Notice = new Notice()
            {
                Id = 1,
                UserId = 1,
                Title = "test title",
                Description = "test description",
                City = "test city",
                Payments = "cast,swish",
                DeliveryMethods = "mail,delivered",
                CreatedAt = new DateTime(),
            }
        };
    }

    [Fact]
    public void putNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.PutById(1, _request));

        // Act
        var httpResponse = _controller.PutProduct(1, _request);

        // Assert 
        httpResponse.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void deleteNotice_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.DeleteById(1));

        // Act
        var httpResponse = _controller.DeleteProduct(1);

        // Assert 
        httpResponse.Should().BeOfType<NotFoundResult>();
    }

}