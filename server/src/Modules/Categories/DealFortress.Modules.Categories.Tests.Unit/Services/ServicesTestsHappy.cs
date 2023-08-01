using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Api.Controllers;

using Moq;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using FluentAssertions;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServicesTestsHappy
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;
    private readonly CategoryRequest _request;
    private readonly CategoryResponse _response;

    public ServicesTestsHappy()
    {
        _repo = new Mock<ICategoriesRepository>();

        _service = new CategoriesService(_repo.Object);

        _request = new CategoryRequest() { Name = "test" };

        _response = new CategoryResponse() { Name = "test" };
    }
    [Fact]
    public void PostDTO_should_complete_to_save_to_db()
    {
        // Arrange
        var completed = false;
         _repo.Setup(repo => repo.Complete()).Raises(f => completed = true);
        // Act

        // Assert 
        completed.Should().Be(true);
    }
}