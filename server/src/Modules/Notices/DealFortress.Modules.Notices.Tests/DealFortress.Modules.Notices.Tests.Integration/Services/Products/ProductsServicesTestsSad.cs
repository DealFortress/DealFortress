using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Notices.Tests.Shared;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class ProductsServicesTestsSad
{
    private readonly IProductsService _service;
    private readonly ProductRequest _request;
    public NoticesFixture? Fixture;

    public ProductsServicesTestsSad()
    {
        _service = CreateNewService();

        _request = NoticesTestModels.CreateNoticeRequest().ProductRequests.First();
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
    public async void PutById_returns_null_when_product_is_not_found()
    {
        // Act
        var response = await _service.PutByIdAsync(-1, _request);

        // Assert
        response.Should().BeNull();
    }

    [Fact]
    public async void DeleteById_returns_null_when_product_is_not_found()
    {
        // Act
        var response = await _service.DeleteByIdAsync(-1);

        // Assert
        response.Should().BeNull();
    }
}