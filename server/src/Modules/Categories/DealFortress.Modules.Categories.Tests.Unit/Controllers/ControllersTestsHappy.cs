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
    private readonly CategoryRequest _request;
    private readonly CategoryResponse _response;

    public ControllersTestsHappy()
    {
        _service = new Mock<ICategoriesService>();
        
        _controller = new CategoriesController(_service.Object);

        _request = new CategoryRequest(){ Name = "test" };

        _response = new CategoryResponse(){ Name = "test" };
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
        var httpResponse = _controller.GetCategories();

        // assert
        httpResponse.Result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public void get_one_by_id_returns_ok()
    {
        // arrange
        _service.Setup(item => item.GetDTOById(1)).Returns(_response);

        // act
        var httpResponse = _controller.GetCategory(1);

        // assert
        httpResponse.Result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public void post_category_returns_created()
    {
        // arrange
        _service.Setup(item => item.PostDTO(_request)).Returns(_response);

        // act
        var httpResponse = _controller.PostCategory(_request);

        // assert
        httpResponse.Result.Should().BeOfType(typeof(CreatedAtActionResult));
    }
}