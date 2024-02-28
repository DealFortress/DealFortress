using Moq;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Integration.Fixture;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Users.Api.Controllers;
using AutoMapper;
using DealFortress.Modules.Notices.Tests.Shared;

namespace DealFortress.Modules.Notices.Tests.Integration;

public class ProductsServicesTestsHappy
{
    private readonly IProductsService _service;
    public NoticesFixture? Fixture;
    private readonly IMapper _mapper;


    public ProductsServicesTestsHappy()
    {
        _mapper = NoticesTestModels.CreateMapper(); 
        _service = CreateNewService(_mapper);
    }

    public IProductsService CreateNewService(IMapper mapper)
    {
        Fixture = new NoticesFixture();

        var repo = new ProductsRepository(Fixture.Context);

        var usersController = new Mock<UsersController>(null);

        return new ProductsService(repo, usersController.Object, mapper);

    }

    [Fact]
    public async Task GetAll_should_return_all_ProductsAsync()
    {
        var parameters = NoticesTestModels.CreateProductsParams();
        // Act
        var productResponses = await _service.GetAllPagedAsync(parameters);

        // Assert 
        productResponses.Entities.Count().Should().Be(2);
    }

}