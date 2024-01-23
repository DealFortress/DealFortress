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

        _request = NoticesTestModels.CreateNoticeRequest().ProductRequests.First();

        _product = NoticesTestModels.CreateNotice().Products!.First();
    }
 

    
    [Fact]
    public async Task GetAll_returns_responseAsync()
    {
        // arrange
        var list = new List<Product>() { _product };
        _repo.Setup(repo => repo.GetAllAsync()).Returns(Task.FromResult<IEnumerable<Product>>(list));
        _categoriesController.Setup(controller => controller.GetCategoryNameById(1)).Returns(Task.FromResult<string?>("CPU"));

        // act
        var response = await _service.GetAllAsync();

        // assert
        response.Should().BeOfType<List<ProductResponse>>();
    }

    [Fact]
    public async Task PutDTO_should_replace_dataAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));

        // Act
         await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PutDTO_should_complete_before_sending_back_DTOAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));

        // Act
         await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PutDTO_should_return_responseAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));

        // Act
        var response =  await _service.PutByIdAsync(1, _request);

        // Assert 
        response.Should().BeOfType<ProductResponse>();
    }

    [Fact]
    public async Task PatchSoldStatusById_should_update_dataAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
         await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Update(It.IsAny<Product>()), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PatchSoldStatusById_should_complete_before_sending_back_DTOAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
         await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PatchSoldStatusById_should_return_responseAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
        var response =  await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        response.Should().BeOfType<ProductResponse>();
    }

    [Fact]
    public async Task PatchSoldStatusById_should_flip_isSoldAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
        var response =  await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        response?.SoldStatus.Should().Be(SoldStatus.Available);
    }


    [Fact]
    public async Task DeleteById_should_remove_data_and_completeAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));

        // Act
         await _service.DeleteByIdAsync(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public async Task DeleteById_should_return_ProductAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Product?>(_product));

        // Act
        var response =  await _service.DeleteByIdAsync(1);

        // Assert 
        response.Should().Be(_product);
    }

}