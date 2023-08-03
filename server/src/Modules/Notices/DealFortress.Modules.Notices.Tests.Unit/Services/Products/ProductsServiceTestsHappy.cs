using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Categories.Api.Controllers;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductsServiceTestsHappy
{
    private readonly IProductsService _service;
    private readonly Mock<IProductsRepository> _repo;
    private readonly ProductRequest _request;
    private readonly Product _product;

    public ProductsServiceTestsHappy()
    {
        _repo = new Mock<IProductsRepository>();

        var noticeRepo = new Mock<INoticesRepository>();

        var categoriesController = new Mock<CategoriesController>();

        _service = new ProductsService(_repo.Object, noticeRepo.Object, categoriesController.Object);

        _request = CreateProductRequest();

        _product = CreateProduct();

        _request = CreateProductRequest();
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

    public ProductResponse CreateProductResponse()

    {
        return new ProductResponse()
        {
            Id = 1,
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSoldSeparately = false,
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New,
            CategoryName = "test category",
            ImageUrls = new List<string> { "https://test" },
            NoticeId = 1,
        };
    }

    public Product CreateProduct()

    {

        return new Product()
        {
            Id = 1,
            Name = "test",
            Price = 1,
            HasReceipt = true,
            IsSold = false,
            IsSoldSeparately = false,
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New,
            Notice = new Notice()
            {
                Id = 1,
                Title = "test title",
                Description = "test description",
                City = "test city",
                Payments = "cast,swish",
                DeliveryMethods = "mail,delivered",
                CreatedAt = new DateTime(),
            }
        };
    }

    [Fact]
    public void GetAllDTO_returns_response()
    {
        // arrange
        var list = new List<Product>() { _product };
        _repo.Setup(repo => repo.GetAll()).Returns(list);

        // act
        var response = _service.GetAllDTO();

        // assert
        response.Should().BeOfType<List<ProductResponse>>();
    }

}