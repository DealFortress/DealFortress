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
    public async void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        await _service.PostAsync(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public async Task GetById_returns_response_when_repo_returns_a_categoryAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Category?>(_category));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().BeOfType<CategoryResponse>();
    }

    [Fact]
    public async void GetAll_returns_response()
    {
        // arrange
        var list = new List<Category>(){ _category }; 
        _repo.Setup(repo => repo.GetAllAsync()).Returns(Task.FromResult<IEnumerable<Category?>>(list));

        // act
        var response = await _service.GetAllAsync();

        // assert
        response.Should().BeOfType<List<CategoryResponse>>();
    }

}