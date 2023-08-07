using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using Moq;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Services;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServiceTestsHappy
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;
    private readonly CategoryRequest _request;
    private readonly Category _category;

    public ServiceTestsHappy()
    {
        _repo = new Mock<ICategoriesRepository>();

        _service = new CategoriesService(_repo.Object);

        _request = new CategoryRequest() { Name = "test" };

        _category = new Category() { Id = 1, Name = "test" };
    }

    [Fact]
    public void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        _service.Post(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public void GetById_returns_response_when_repo_returns_a_category()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_category);

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public void GetAll_returns_response()
    {
        // arrange
        var list = new List<Category>(){ _category }; 
        _repo.Setup(repo => repo.GetAll()).Returns(list);

        // act
        var response = _service.GetAll();

        // assert
        response.Should().BeOfType<List<CategoryResponse>>();
    }

}