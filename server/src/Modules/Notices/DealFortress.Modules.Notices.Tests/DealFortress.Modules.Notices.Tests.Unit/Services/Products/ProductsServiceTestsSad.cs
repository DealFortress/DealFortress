using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Modules.Users.Api.Controllers;
using FluentAssertions;
using Moq;

namespace DealFortress.Modules.Products.Tests.Unit;

public class ProductsServiceTestsSad
{
    private readonly IProductsService _service;
    private readonly Mock<IProductsRepository> _repo;
    private readonly ProductRequest _request;
    private readonly Mock<UsersController> _usersController;
    private readonly IMapper _mapper;


    public ProductsServiceTestsSad()
    {
        _repo = new Mock<IProductsRepository>();

        _mapper = NoticesTestModels.CreateMapper(); 

        _usersController = new Mock<UsersController>(null);

        _service = new ProductsService(_repo.Object, _usersController.Object, _mapper);

        _request = NoticesTestModels.CreateNoticeRequest().ProductRequests.First();
    }

    [Fact]
    public async Task PutById_returns_null_when_id_doesnt_existAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // act
        var response = await _service.PutByIdAsync(1, _request);

        // assert
        response.Should().BeNull();
    }

    [Fact]
    public async Task PutDTO_should_not_replace_data_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.Never());
    }

    [Fact]
    public async Task PutDTO_should_not_complete_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public async Task PutDTO_should_return_null_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        var response = await _service.PutByIdAsync(1, _request);

        // Assert 
        response.Should().BeNull();
    }

    [Fact]
    public async Task PatchSoldStatusById_should_not_replace_data_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
        await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.Never());
    }

    [Fact]
    public async Task PatchSoldStatusById_should_not_complete_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
        await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public async Task PatchSoldStatusById_should_return_null_if_product_not_foundAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, "")).Returns(Task.FromResult<bool>(true));

        // Act
        var response = await _service.PatchSoldStatusByIdAsync(1, SoldStatus.Available);

        // Assert 
        response.Should().BeNull();
    }

    [Fact]
    public async Task DeleteById_should_not_remove_data_and_complete_if_id_doesnt_existAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        await _service.DeleteByIdAsync(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Product>()), Times.Never());
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public async Task DeleteById_should_not_return_product_if_id_doesnt_existAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // Act
        var response = await _service.DeleteByIdAsync(1);

        // Assert 
        response.Should().BeNull();
    }
}