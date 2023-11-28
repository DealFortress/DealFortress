using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Moq;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using FluentAssertions;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Services;

namespace DealFortress.Modules.Notices.Tests.Unit;

public class NoticesServiceTestsSad
{
    private readonly INoticesService _service;
    private readonly Mock<INoticesRepository> _repo;
    private readonly NoticeRequest _request;
    private readonly Notice _notice;

    public NoticesServiceTestsSad()
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
                    IsSold = false,
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
    public void GetById_returns_null_when_notice_is_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().BeNull();
    }

    [Fact]
    public void PutDTO_should_not_replace_data_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Add(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
    }

    [Fact]
    public void PutDTO_should_not_complete_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.PutById(1, _request);

        // Assert 
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public void PutDTO_should_return_null_if_notice_not_found()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        var response = _service.PutById(1, _request);

        // Assert 
        response.Should().BeNull();
    }

    [Fact]
    public void DeleteById_should_not_remove_data_and_complete_if_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        _service.DeleteById(1);

        // Assert 
        _repo.Verify(repo => repo.Remove(It.IsAny<Notice>()), Times.Never());
        _repo.Verify(repo => repo.Complete(), Times.Never());
    }

    [Fact]
    public void DeleteById_should_not_return_Notice_if_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // Act
        var response = _service.DeleteById(1);

        // Assert 
        response.Should().BeNull();
    }

}