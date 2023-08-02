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
    private readonly CategoryRequest _request;
    private readonly CategoryResponse _response;

    public ControllerTestsSad()
    {
        _service = new Mock<ICategoriesService>();
        
        _controller = new CategoriesController(_service.Object);

        _request = new CategoryRequest(){ Name = "test" };

        _response = new CategoryResponse(){ Name = "test" };
    }


    [Fact]
    public void get_by_id_returns_not_found_when_service_returns_null()
    {
        // Arrange
        _service.Setup(service => service.GetDTOById(1));

        // Act
        var httpResponse = _controller.GetCategory(1);

        // Assert 

        httpResponse.Result.Should().BeOfType<NotFoundResult>();
    }
}