using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Api.Controllers;
using Moq;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using DealFortress.Modules.Categories.Tests.Integration.Fixture;
using DealFortress.Modules.Categories.Core.DAL.Repositories;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServicesTestsHappy
{
    private readonly ICategoriesService _service;
    private readonly CategoriesRepository _repo;
    private readonly CategoryRequest _request;
    private readonly Category _category;
    public CategoriesFixture Fixture;

    public ServicesTestsHappy()
    {
        Fixture = new CategoriesFixture();

        _repo = new CategoriesRepository(Fixture.context);

        _service = new CategoriesService(_repo);

        _request = new CategoryRequest() { Name = "test" };

        _category = new Category() { Id = 1, Name = "test" };
    }

    [Fact]
    public void GetAll_should_return_all_categories()
    {
        // Act
        var categoryResponses = _service.GetAllDTO();

        // Assert 
        categoryResponses.Count().Should().Be(2);
        Fixture.Dispose();
    }

    [Fact]
    public void GetAll_should_return_all_categoriess()
    {
        // Act

        var categoryResponses = _service.GetAllDTO();

        // Assert 
        categoryResponses.Count().Should().Be(2);
        Fixture.Dispose();
    }

}