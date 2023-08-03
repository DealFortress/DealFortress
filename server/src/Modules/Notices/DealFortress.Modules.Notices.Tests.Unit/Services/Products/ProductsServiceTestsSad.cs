using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using FluentAssertions;
using Moq;

namespace DealFortress.Modules.Products.Tests.Unit;

public class ProductsServiceTestsSad
{
    private readonly IProductsService _service;
    private readonly Mock<IProductsRepository> _repo;
    private readonly ProductRequest _request;
    // private readonly ProductResponse _response;

    public ProductsServiceTestsSad()
    {
        _repo = new Mock<IProductsRepository>();

        var noticeRepo = new Mock<INoticesRepository>();

        var categoriesController = new Mock<CategoriesController>();

        _service = new ProductsService(_repo.Object, noticeRepo.Object, categoriesController.Object);

        _request = CreateProductRequest();
        // _response = new ProductResponse(){ Name = "test" };
    }

    public ProductRequest CreateProductRequest()
    {
        return new ProductRequest()
        {
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSold = false,
            IsSoldSeparately = false,
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New
        };
    }


    [Fact]
    public void PutDTOById_returns_null_when_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // act
        var response = _service.PutDTOById(1, _request);

        // assert
        response.Should().Be(null);
    }
}