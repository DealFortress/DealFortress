using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticesServiceTestsHappy
{
    private readonly INoticesService _service;
    private readonly Mock<INoticesRepository> _repo;
    private readonly NoticeRequest _request;
    private readonly Notice _notice;

    public NoticesServiceTestsHappy()
    {
        _repo = new Mock<INoticesRepository>();

        var productsService = new Mock<IProductsService>();

        _service = new NoticesService(productsService.Object, _repo.Object);

        _request = CreateNoticeRequest();

        _notice = CreateNotice();

        _request = CreateNoticeRequest();
    }


    public NoticeRequest CreateNoticeRequest()
    {
        return new NoticeRequest()
        {
            UserId = 1,
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" },
            ProductRequests = new List<ProductRequest>
            {
                new ProductRequest()
                {
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
                    IsSold = false,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    ImageRequests = new List<ImageRequest>(){
                        new ImageRequest()
                        {
                            Url = "Hello world"
                        }
                    }
                }
            }
        };
    }

    public NoticeResponse CreateNoticeResponse()

    {
        return new NoticeResponse()
        {
            Id = 1,
            UserId = 1,
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = new[] { "cast", "swish" },
            DeliveryMethods = new[] { "mail", "delivered" },
            CreatedAt = new DateTime(),
            Products = new List<ProductResponse>
            {
                new ProductResponse()
                {
                    Id = 1,
                    Name = "test",
                    Price = 1,
                    HasReceipt = true,
                    IsSoldSeparately = false,
                    Warranty = "month",
                    CategoryId = 1,
                    Condition = Condition.New,
                    Images = new List<ImageResponse>(){
                        new ImageResponse()
                        {
                            Url = "Hello world"
                        }
                    },
                    NoticeId = 1,
                }
            }
        };
    }

    public Notice CreateNotice()

    {
        return new Notice()
        {
            Id = 1,
            UserId = 1,
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = "cast,swish",
            DeliveryMethods = "mail,delivered",
            CreatedAt = new DateTime(),
            Products = new List<Product>
            {
                new Product()
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
                    Notice = this._notice
                }
            }
        };
    }

    [Fact]
    public void GetAll_returns_response()
    {
        // arrange
        var list = new List<Notice>() { _notice };
        _repo.Setup(repo => repo.GetAllWithProductsAndImages()).Returns(list);

        // act
        var response = _service.GetAll();

        // assert
        response.Should().BeOfType<List<NoticeResponse>>();
    }

    [Fact]
    public void GetById_returns_response_when_repo_returns_a_notice()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdWithProducts(1)).Returns(_notice);

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeOfType<NoticeResponse>();
    }

    [Fact]
    public void Post_should_complete_before_sending_back_DTO()
    {
        // Act
        _service.Post(_request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());

    }

    [Fact]
    public void PutDTO_should_replace_data()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdWithProducts(1)).Returns(_notice);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_complete_before_sending_back_DTO()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdWithProducts(1)).Returns(_notice);

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void PutDTO_should_return_response()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdWithProducts(1)).Returns(_notice);

        // Act
        var response = _service.PutById(1, _request);

        // Assert 
        response.Should().BeOfType<NoticeResponse>();
    }

    [Fact]
    public void DeleteById_should_remove_data_and_complete()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        _service.DeleteById(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.AtLeastOnce());
        _repo.Verify(repo => repo.Complete(), Times.AtLeastOnce());
    }

    [Fact]
    public void DeleteById_should_return_Notice()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1)).Returns(_notice);

        // Act
        var response = _service.DeleteById(1);

        // Assert 
        response.Should().Be(_notice);
    }
}