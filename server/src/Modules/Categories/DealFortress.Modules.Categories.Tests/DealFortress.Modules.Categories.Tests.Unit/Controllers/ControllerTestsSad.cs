using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ControllerTestsSad
{
    private readonly CategoriesController _controller;
    private readonly Mock<ICategoriesService> _service;

    public ControllerTestsSad()
    {
        _service = new Mock<ICategoriesService>();
        
        _controller = new CategoriesController(_service.Object);
    }


    [Fact]
    public async void GetCategory_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.GetByIdAsync(1));

        // Act
        var httpResponse = await _controller.GetCategoryAsync(1);

        // Assert 
        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }
}