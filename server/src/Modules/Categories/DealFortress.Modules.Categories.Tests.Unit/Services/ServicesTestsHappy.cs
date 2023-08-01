using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Api.Controllers;

using Moq;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Categories.Core.Domain.Entities;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServicesTestsHappy
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;
    private readonly CategoryRequest _request;
    private readonly Category _category;

    public ServicesTestsHappy()
    {
        _repo = new Mock<ICategoriesRepository>();

        _service = new CategoriesService(_repo.Object);

        _request = new CategoryRequest() { Name = "test" };

        _category = new Category() { Id = 1, Name = "test" };
    }

    [Fact]
    public void PostDTO_should_complete_to_save_to_db()
    {
        // Act
        _service.PostDTO(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public void GetDTOById_returns_response_when_repo_returns_a_category()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_category);

        // act
        var response = _service.GetDTOById(1);

        // assert
        response.Should().BeOfType(typeof(CategoryResponse));
    }

    [Fact]
    public void GetAllDTO_returns_response()
    {
        // arrange
        var list = new List<Category>(){ _category }; 
        _repo.Setup(repo => repo.GetAll()).Returns(list);

        // act
        var response = _service.GetAllDTO();

        // assert
        response.Should().BeOfType(typeof(List<CategoryResponse>));
    }

}