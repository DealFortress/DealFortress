using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ControllersTestsHappy
{
    private readonly CategoriesController _controller;
    private readonly Mock<ICategoriesService> _service;

    public ControllersTestsHappy()
    {
        _service = new Mock<ICategoriesService>();
        
        _controller = new CategoriesController(_service.Object);
    }
    
    [Fact]
    public void get_all_returns_ok()
    {
        // arrange
        var content = new List<CategoryResponse>()
        {
            new CategoryResponse() { Name = "test" }
        };
        _service.Setup(item => item.GetAllDTO()).Returns(content);
        
        // act
        var dtos = _controller.GetCategories();

        // assert
        dtos.Result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public void get_one_by_id_returns_ok()
    {
        // arrange
        var content = new CategoryResponse(){Name = "test"};
        _service.Setup(item => item.GetDTOById(1)).Returns(content);

        // act
        var dto = _controller.GetCategory(1);

        // assert
        dto.Result.Should().BeOfType(typeof(OkObjectResult));
    }
}