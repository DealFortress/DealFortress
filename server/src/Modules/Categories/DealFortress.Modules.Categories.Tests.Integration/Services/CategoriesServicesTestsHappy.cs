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
        Fixture.Initialize();
        
        _repo = new CategoriesRepository(Fixture.Context);

        _service = new CategoriesService(_repo);

        _request = new CategoryRequest() { Name = "test" };
    }

    [Fact]
    public async void GetAll_should_return_all_categories()
    {
        // Act
        var categoryResponses = await _service.GetAllAsync();

        // Assert 
        categoryResponses.Count().Should().Be(2);
    }

    [Fact]
    public async void GetById_should_return_the_category_matching_id()
    {
        // Act

        var categoryResponse = await _service.GetByIdAsync(1);

        // Assert 
        categoryResponse?.Name.Should().Be("Name 1");
        categoryResponse?.Id.Should().Be(1);
    }

    [Fact]
    public async void Post_should_add_category_in_db()
    {
        // Act
        var postResponse = await _service.PostAsync(_request);

        // Assert
        Fixture?.Context.Categories.Find(postResponse.Id)?.Name.Should().Be(_request.Name);
    }

}