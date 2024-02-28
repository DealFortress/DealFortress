using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Shared.Abstractions.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using MockQueryable.Moq;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductControllersTestsHappy
{
    private readonly ProductsController _controller;
    private readonly Mock<IProductsService> _service;
    private readonly ProductResponse _response;
    private readonly Product? _product;

    public ProductControllersTestsHappy()
    {
        _service = new Mock<IProductsService>();

        _controller = new ProductsController(_service.Object);

        _response = NoticesTestModels.CreateNoticeResponse().Products!.First();

        _product = NoticesTestModels.CreateNotice().Products?.First();

        _controller.CreateFakeClaims();
    }


    [Fact]
    public async void GetProducts_should_return_ok()
    {
        // Arrange
        var entities = new List<ProductResponse>{_response}.AsQueryable().BuildMock();
        var list = PagedList<ProductResponse>.CreateAsync(entities, 0, 20);
        _service.Setup(service => service.GetAllPagedAsync(It.IsAny<GetProductsParams>())).Returns(list);
        // Act
        var httpResponses = await _controller.GetProductsAsync(null, 0, 20);
        // Assert 
        httpResponses.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async void GetProducts_return_list_of_response_when_server_returns_responses()
    {
        // Arrange
        var entities = new List<ProductResponse>{_response}.AsQueryable().BuildMock();
        var list = PagedList<ProductResponse>.CreateAsync(entities, 0, 20);
        _service.Setup(service => service.GetAllPagedAsync(It.IsAny<GetProductsParams>())).Returns(list);
        
        // Act
        var httpResponses = await _controller.GetProductsAsync(null, 0, 20);
        // Assert 
        httpResponses.Should().NotBeNull();
        var content = httpResponses.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<PagedList<ProductResponse>>();
        content.As<PagedList<ProductResponse>>().Entities.First().Should().Be(_response);
    }

    [Fact]
    public async Task PatchProductSoldStatus_return_ok_object_response_when_service_return_responseAsync()
    {
        // Arrange
        _service.Setup(service => service.PatchSoldStatusByIdAsync(1, SoldStatus.Available)).Returns(Task.FromResult<ProductResponse?>(_response));
        // Act
        var httpResponse = await _controller.PatchProductSoldStatusAsync(1, SoldStatus.Available);
        // Assert 
        httpResponse.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task DeleteProduct_should_return_no_contentAsync()
    {
        // Arrange
        _service.Setup(service => service.DeleteByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));
        // Act
        var httpResponse = await _controller.DeleteProductAsync(1);
        // Assert 
        httpResponse.Should().BeOfType<NoContentResult>();
    }
}