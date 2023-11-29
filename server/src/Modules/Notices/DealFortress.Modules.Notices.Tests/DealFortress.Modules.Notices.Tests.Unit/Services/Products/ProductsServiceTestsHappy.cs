using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Notices.Tests.Shared;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class ProductsServiceTestsHappy
{
    private readonly IProductsService _service;
    private readonly Mock<IProductsRepository> _repo;
    private readonly ProductRequest _request;
    private readonly Product _product;
    private readonly Mock<CategoriesController> _categoriesController;
    private readonly Mock<UsersController> _usersController;

    public ProductsServiceTestsHappy()
    {
        _repo = new Mock<IProductsRepository>();

        _categoriesController = new Mock<CategoriesController>(null);

        _usersController = new Mock<UsersController>(null);
    
        var imagesService = new Mock<IImagesService>();

        _service = new ProductsService(_repo.Object, imagesService.Object, _usersController.Object);

        _request = NoticesTestModels.CreateProductRequest();

        _product = NoticesTestModels.CreateProduct();

        _request = NoticesTestModels.CreateProductRequest();
    }
 

    
    [Fact]
    public void GetAll_returns_response()
    {
        // arrange
        var list = new List<Product>() { _product };
        _repo.Setup(repo => repo.GetAll()).Returns(list);
        _categoriesController.Setup(controller => controller.GetCategoryNameById(1)).Returns("CPU");

        // act
        var response = _service.GetAll();

        // assert
        response.Should().BeOfType<List<ProductResponse>>();
    }

    [Fact]
    public void PutDTO_should_replace_data()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Product>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_complete_before_sending_back_DTO()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_return_response()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);

        // Act
        var response = _service.PutById(1, _request);

        // Assert 
        response.Should().BeOfType<ProductResponse>();
    }

    [Fact]
    public void PatchSoldStatusById_should_update_data()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);
        _usersController.Setup(controller => controller.IsUserNoticeCreator("authid", 1)).Returns(true);

        // Act
        _service.PatchSoldStatusById(1, SoldStatus.Available,"authid");

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Update(It.IsAny<Product>()), Times.AtLeastOnce());
    }

    [Fact]
    public void PatchSoldStatusById_should_complete_before_sending_back_DTO()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);
        _usersController.Setup(controller => controller.IsUserNoticeCreator("authid", 1)).Returns(true);

        // Act
        _service.PatchSoldStatusById(1, SoldStatus.Available,"authid");

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void PatchSoldStatusById_should_return_response()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);
        _usersController.Setup(controller => controller.IsUserNoticeCreator("authid", 1)).Returns(true);

        // Act
        var response = _service.PatchSoldStatusById(1, SoldStatus.Available,"authid");

        // Assert 
        response.Should().BeOfType<ProductResponse>();
    }

    [Fact]
    public void PatchSoldStatusById_should_flip_isSold()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);
        _usersController.Setup(controller => controller.IsUserNoticeCreator("authid", 1)).Returns(true);

        // Act
        var response = _service.PatchSoldStatusById(1, SoldStatus.Available,"authid");

        // Assert 
        response?.SoldStatus.Should().Be(SoldStatus.Available);
    }


    [Fact]
    public void DeleteById_should_remove_data_and_complete()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);

        // Act
        _service.DeleteById(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void DeleteById_should_return_Product()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_product);

        // Act
        var response = _service.DeleteById(1);

        // Assert 
        response.Should().Be(_product);
    }

}