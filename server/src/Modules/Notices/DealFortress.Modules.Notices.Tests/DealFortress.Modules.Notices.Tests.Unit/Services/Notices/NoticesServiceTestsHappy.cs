using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Tests.Shared;
using DealFortress.Modules.Users.Api.Controllers;
using AutoMapper;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticesServiceTestsHappy
{
    private readonly INoticesService _service;
    private readonly Mock<INoticesRepository> _repo;
    private readonly NoticeRequest _request;
    private readonly Mock<UsersController> _usersController;
    private readonly Mock<IProductsService> _productsService;
    private readonly Notice _notice;
    private readonly IMapper _mapper;


    public NoticesServiceTestsHappy()
    {
        _repo = new Mock<INoticesRepository>();
        _mapper = NoticesTestModels.CreateMapper();  

        _request = NoticesTestModels.CreateNoticeRequest();
        _notice = NoticesTestModels.CreateNotice();
        _request = NoticesTestModels.CreateNoticeRequest();

        _productsService = new Mock<IProductsService>();

        _usersController = new Mock<UsersController>(null);

        _service = new NoticesService(_repo.Object, _usersController.Object, _mapper);
    }

    [Fact]
    public void GetAll_returns_response()
    {
        // arrange
        var entities = new List<Notice>{_notice};
        var list = PagedList<Notice>.Create(entities.AsQueryable(), 0, 20);
        _repo.Setup(repo => repo.GetAllPaged(It.IsAny<PagedParams>())).Returns(list);
        var parameters = NoticesTestModels.CreatePagedParams();

        // act
        var response =  _service.GetAllPaged(parameters);

        // assert
        response.Should().BeOfType<PagedList<NoticeResponse>>();
    }

    [Fact]
    public async Task GetById_returns_response_when_repo_returns_a_noticeAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().BeOfType<NoticeResponse>();
    }

    [Fact]
    public async Task Post_should_complete_before_sending_back_DTOAsync()
    {
        // Act
        await _service.PostAsync(_request);


        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public async Task PutDTO_should_replace_dataAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));


        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.AddAsync(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PutDTO_should_complete_before_sending_back_DTOAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));


        // Act
        await _service.PutByIdAsync(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public async Task PutDTO_should_return_responseAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));


        // Act
        var response = await _service.PutByIdAsync(1, _request);

        // Assert 
        response.Should().BeOfType<NoticeResponse>();
    }

    // [Fact]
    // public async void PutDTO_should_return_images_inside_response()
    // {
    //    // arrange
    //     _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));

    //     _productsService.Setup(service => service.ToProduct(It.IsAny<ProductRequest>(), It.IsAny<Notice>())).Returns(_notice.Products.First());
        
            
    //     _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));

    
    //     // Act
    //     var response = await _service.PutByIdAsync(1, _request);

    //     // Assert 
    //     response?.Products?.First().Images?.Count().Should().Be(1); 
    // }

    [Fact]
    public void DeleteById_should_remove_data_and_complete()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));


        // Act
        _service.DeleteByIdAsync(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public async Task DeleteById_should_return_NoticeAsync()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1)).Returns(Task.FromResult<Notice?>(_notice));
        _usersController.Setup(controller => controller.IsUserEntityCreatorAsync(1, null)).Returns(Task.FromResult<bool>(true));


        // Act
        var response = await _service.DeleteByIdAsync(1);

        // Assert 
        response.Should().Be(_notice);
    }
}