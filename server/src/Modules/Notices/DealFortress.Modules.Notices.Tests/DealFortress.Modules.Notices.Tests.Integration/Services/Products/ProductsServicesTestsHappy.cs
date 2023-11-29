using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Users.Api.Controllers;

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

        var usersController = new Mock<UsersController>(null);

        var imagesService = new Mock<IImagesService>();

        return new ProductsService(repo, imagesService.Object, usersController.Object);

    }

    [Fact]
    public void GetAll_should_return_all_Products()
    {
        // Act
        var productResponses = _service.GetAll();

        // Assert 
        productResponses.Count().Should().Be(2);
    }

}