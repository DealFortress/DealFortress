using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Tests.Shared;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductControllersTestsSad
{
    private readonly ProductsController _controller;
    private readonly Mock<IProductsService> _service;

    public ProductControllersTestsSad
()
    {
        _service = new Mock<IProductsService>();

        _controller = new ProductsController(_service.Object);
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