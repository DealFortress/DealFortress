using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class ProductsServicesTestsHappy
{
    private readonly IProductsService _service;
    public NoticesFixture? Fixture;

    public ProductsServicesTestsHappy()
    {
        _service = CreateNewService();
    }

        public IProductsService CreateNewService()
    {
        Fixture = new NoticesFixture();

        var repo = new ProductsRepository(Fixture.Context);

        var categoriesController = new Mock<CategoriesController>(null);

        return new ProductsService(repo, categoriesController.Object);

    }

    [Fact]
    public void GetAllDTO_should_return_all_Products()
    {
        // Act
        var productResponses = _service.GetAllDTO();

        // Assert 
        productResponses.Count().Should().Be(2);
    }

}