using DealFortress.Modules.Categories.Api.Controllers;
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
        var content = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAllDTO()).Returns(content);
        
        // act
        var httpResponse = _controller.GetCategories();

        // assert
        httpResponse.Result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public void get_all_returns_list_of_response_when_service_returns_response()
    {
        // arrange
        var list = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAllDTO()).Returns(list);
        
        // act
        var httpResponse = _controller.GetCategories();

        // assert
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType(typeof(List<CategoryResponse>));
    }

    [Fact]
    public void get_one_by_id_returns_ok_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetDTOById(1)).Returns(_response);

        // act
        var httpResponse = _controller.GetCategory(1);

        // assert
        httpResponse.Result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public void get_one_by_id_returns_category_response_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetDTOById(1)).Returns(_response);

        // act
        var httpResponse = _controller.GetCategory(1);

        // assert
        httpResponse.Result.As<OkObjectResult>().Value.Should().BeOfType(typeof(CategoryResponse));
    }

    [Fact]
    public void post_category_returns_created_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.PostDTO(_request)).Returns(_response);

        // act
        var httpResponse = _controller.PostCategory(_request);

        // assert
        httpResponse.Result.Should().BeOfType(typeof(CreatedAtActionResult));
    }

    [Fact]
    public void post_category_returns_categoryResponse_when_service_returns_response()
    {
        // arrange
        _service.Setup(item => item.PostDTO(_request)).Returns(_response);

        // act
        var httpResponse = _controller.PostCategory(_request);

        // assert
        httpResponse.Result.As<CreatedAtActionResult>().Value.Should().BeOfType(typeof(CategoryResponse));
    }

    [Fact]
    public void get_category_name_by_id_returns_name_of_category_when_service_returns_response()
    {
        // arrange
        _service.Setup(item => item.GetDTOById(1)).Returns(_response);

        // act
        var response = _controller.GetCategoryNameById(1);

        //assert
        response.Should().Be("test");
    }
}