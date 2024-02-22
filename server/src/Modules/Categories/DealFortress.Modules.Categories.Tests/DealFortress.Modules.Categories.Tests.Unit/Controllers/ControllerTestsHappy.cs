using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Tests.Shared;
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

        _request = CategoriesTestModels.CreateCategoryRequest();

        _response = CategoriesTestModels.CreateCategoryResponse();
    }
    
    [Fact]
    public async void GetCategories_returns_ok()
    {
        // arrange
        var content = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAllAsync()).Returns(Task.FromResult<IEnumerable<CategoryResponse>>(content));
        
        // act
        var httpResponse = await _controller.GetCategoriesAsync();

        // assert
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async void GetCategories_list_of_response_when_service_returns_response()
    {
        // arrange
        var list = new List<CategoryResponse>(){ _response };
        _service.Setup(service => service.GetAllAsync()).Returns(Task.FromResult<IEnumerable<CategoryResponse>>(list));
        
        // act
        var httpResponse = await _controller.GetCategoriesAsync();

        // assert
        var content = httpResponse.Result.As<OkObjectResult>().Value;
        content.Should().BeOfType<List<CategoryResponse>>();
    }

    [Fact]
    public async void GetCategory_returns_ok_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<CategoryResponse?>(_response));

        // act
        var httpResponse = await _controller.GetCategoryAsync(1);

        // assert
        httpResponse.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async void GetCategory_returns_category_response_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.GetByIdAsync(1)).Returns(Task.FromResult<CategoryResponse?>(_response));

        // act
        var httpResponse = await _controller.GetCategoryAsync(1);

        // assert
        httpResponse.Result.As<OkObjectResult>().Value.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public async void PostCategory_returns_created_when_service_returns_response()
    {
        // arrange
        _service.Setup(service => service.PostAsync(_request)).Returns(Task.FromResult<CategoryResponse?>(_response));

        // act
        var httpResponse = await _controller.PostCategoryAsync(_request);

        // assert
        httpResponse.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task PostCategory_returns_categoryResponse_when_service_returns_responseAsync()
    {
        // arrange
        _service.Setup(item => item.PostAsync(_request)).Returns(Task.FromResult<CategoryResponse>(_response));

        // act
        var httpResponse = await _controller.PostCategoryAsync(_request);

        // assert
        httpResponse.Result.As<CreatedAtActionResult>().Value.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public async Task GetCategoryNameById_returns_name_of_category_when_service_returns_responseAsync()
    {
        // arrange
        _service.Setup(item => item.GetByIdAsync(1)).Returns(Task.FromResult<CategoryResponse?>(_response));

        // act
        var response = await _controller.GetCategoryNameById(1);

        //assert
        response.Should().Be("test");
    }
}