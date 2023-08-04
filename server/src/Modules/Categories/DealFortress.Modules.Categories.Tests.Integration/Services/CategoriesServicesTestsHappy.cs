using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using FluentAssertions;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Tests.Integration.Fixture;
using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class CategoriesServicesTestsHappy: IClassFixture<CategoriesFixture>
{
    private readonly ICategoriesService _service;
    private readonly CategoriesRepository _repo;
    private readonly CategoryRequest _request;
    public CategoriesFixture Fixture;

    public CategoriesServicesTestsHappy(CategoriesFixture fixture)
    {
        Fixture = fixture;

        _repo = new CategoriesRepository(Fixture.context);

        _service = new CategoriesService(_repo);

        _request = new CategoryRequest() { Name = "test" };
    }

    [Fact]
    public void GetAllDTO_should_return_all_categories()
    {
        // Act
        var categoryResponses = _service.GetAllDTO();

        // Assert 
        categoryResponses.Count().Should().Be(2);
    }

    [Fact]
    public void GetDTOById_should_return_the_category_matching_id()
    {
        // Act

        var categoryResponse = _service.GetDTOById(1);

        // Assert 
        categoryResponse?.Name.Should().Be("Name 1");
        categoryResponse?.Id.Should().Be(1);
    }

    [Fact]
    public void PostDTO_should_add_category_in_db()
    {
        // Act
        var postResponse = _service.PostDTO(_request);
        var categoryResponse = _service.GetDTOById(postResponse.Id);
        // Assert
        categoryResponse?.Name.Should().Be(_request.Name);
    }

}