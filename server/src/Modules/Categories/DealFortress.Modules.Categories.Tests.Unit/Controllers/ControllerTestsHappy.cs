using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ControllerTestsHappy
{
    private readonly CategoriesController _controller;
    private readonly Mock<ICategoriesService> _service;
    private readonly CategoryRequest _request;
    private readonly CategoryResponse _response;

    public ControllerTestsHappy()
    {
        _service = new Mock<ICategoriesService>();
        
        _controller = new CategoriesController(_service.Object);

        _request = new CategoryRequest(){ Name = "test" };

        _response = new CategoryResponse(){ Name = "test" };
    }
    
    [Fact]
    public void GetCategories_returns_ok()
    {
        // arrange
        var content = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAll()).Returns(content);
        
        // act
        var httpResponse = _controller.GetCategories();

        // assert
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetCategories_list_of_response_when_service_returns_response()
    {
        // arrange
        var list = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAll()).Returns(list);
        
        // act
        var httpResponse = _controller.GetCategories();

        // assert
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<List<CategoryResponse>>();
    }

    [Fact]
    public void GetCategory_returns_ok_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);

        // act
        var httpResponse = _controller.GetCategory(1);

        // assert
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void GetCategory_returns_category_response_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetById(1)).Returns(_response);

        // act
        var httpResponse = _controller.GetCategory(1);

        // assert
        httpResponse.Result.As<OkObjectResult>().Value.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public void PostCategory_returns_created_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.Post(_request)).Returns(_response);

        // act
        var httpResponse = _controller.PostCategory(_request);

        // assert
        httpResponse.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public void PostCategory_returns_categoryResponse_when_service_returns_response()
    {
        // arrange
        _service.Setup(item => item.Post(_request)).Returns(_response);

        // act
        var httpResponse = _controller.PostCategory(_request);

        // assert
        httpResponse.Result.As<CreatedAtActionResult>().Value.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public void GetCategoryNameById_returns_name_of_category_when_service_returns_response()
    {
        // arrange
        _service.Setup(item => item.GetById(1)).Returns(_response);

        // act
        var response = _controller.GetCategoryNameById(1);

        //assert
        response.Should().Be("test");
    }
}