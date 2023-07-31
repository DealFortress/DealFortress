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
    private readonly Mock<CategoriesService> _service;

    public ControllersTestsHappy()
    {
        _service = new Mock<CategoriesService>(null);
        
        _controller = new CategoriesController(_service.Object);
    }
    
    [Fact]
    public void get_all_returns_ok()
    {
        var content = new List<CategoryResponse>()
        {
            new CategoryResponse() { Name = "test" }
        };

        _service.Setup(item => item.GetAllDTO()).Returns(content);
        
        var dtos = _controller.GetCategories();
        dtos.Result.Should().BeOfType(typeof(OkObjectResult));
    }
}