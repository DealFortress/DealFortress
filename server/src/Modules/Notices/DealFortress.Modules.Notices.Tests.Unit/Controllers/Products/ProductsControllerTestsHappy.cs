using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductControllersTestsHappy
{
    private readonly ProductsController _controller;
    private readonly Mock<IProductsService> _service;
    private readonly ProductRequest _request;
    private readonly ProductResponse _response;
    private readonly Product _Product;

    public ProductControllersTestsHappy()
    {
        _service = new Mock<IProductsService>();

        _controller = new ProductsController(_service.Object);

        _request = CreateProductRequest();

        _response = CreateProductResponse();

        _Product = CreateProduct();
    }

    public ProductRequest CreateProductRequest()
    {
        return new ProductRequest()
        {
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSold = false,
            IsSoldSeparately = false,
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New
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
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New,
            CategoryName = "test category",
            ImageUrls = new List<string> { "https://test" },
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
    public void GetProducts_should_return_ok()
    {
        // Arrange
        var content = new List<ProductResponse> { _response };
        _service.Setup(service => service.GetAllDTO()).Returns(content);
        // Act
        var httpResponses = _controller.GetProducts();
        // Assert 
        httpResponses.Result.Should().BeOfType<OkObjectResult>();
    }

    // [Fact]
    // public void GetProducts_return_list_of_response_when_server_returns_responses()
    // {
    //     // Arrange
    //     var list = new List<ProductResponse> { _response };
    //     _service.Setup(service => service.GetAllDTO()).Returns(list);
    //     // Act
    //     var httpResponses = _controller.GetProducts();
    //     // Assert 
    //     var content = httpResponses.Result.As<OkObjectResult>().Value;
    //     content.Should().BeOfType<List<ProductResponse>>();
    // }
    // [Fact]
    // public void GetProduct_return_ok_when_service_return_response()
    // {
    //     // Arrange
    //     _service.Setup(service => service.GetDTOById(1)).Returns(_response);
    //     // Act
    //     var httpResponse = _controller.GetProduct(1);
    //     // Assert 
    //     httpResponse.Result.Should().BeOfType<OkObjectResult>();
    // }

    // [Fact]
    // public void GetProduct_return_response_when_server_returns_response()
    // {
    //     // Arrange
    //     _service.Setup(service => service.GetDTOById(1)).Returns(_response);
    //     // Act
    //     var httpResponse = _controller.GetProduct(1);
    //     // Assert 
    //     var content = httpResponse.Result.As<OkObjectResult>().Value;
    //     content.Should().BeOfType<ProductResponse>();
    // }
    // [Fact]
    // public void PutProduct_return_no_content_when_service_return_response()
    // {
    //     // Arrange
    //     _service.Setup(service => service.PutDTOById(1, _request)).Returns(_response);
    //     // Act
    //     var httpResponse = _controller.PutProduct(1, _request);
    //     // Assert 
    //     httpResponse.Should().BeOfType<NoContentResult>();
    // }
    // [Fact]
    // public void DeleteProduct_should_return_no_content()
    // {
    //     // Arrange
    //     _service.Setup(service => service.DeleteById(1)).Returns(_Product);
    //     // Act
    //     var httpResponse = _controller.DeleteProduct(1);
    //     // Assert 
    //     httpResponse.Should().BeOfType<NoContentResult>();
    // }
}