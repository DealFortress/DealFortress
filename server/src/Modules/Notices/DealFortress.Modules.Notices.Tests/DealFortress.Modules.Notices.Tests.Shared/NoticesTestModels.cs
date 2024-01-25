using System.Security.Claims;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Notices.Tests.Shared;

public static class NoticesTestModels
{
    public static Notice CreateNotice()

    {
        var notice = new Notice()
        {
            Id = 1,
            UserId = 1,
            Title = "test title",
            Description = "test description",
            City = "test city",
            Payments = "cast,swish",
            DeliveryMethods = "mail,delivered",
            CreatedAt = new DateTime(),
            Products = new List<Product>()
        };

        notice.Products.Add(new Product()
        {
            Id = 1,
            Name = "test",
            Price = 1,
            HasReceipt = true,
            Images = new List<Image>(),
            SoldStatus = SoldStatus.Available,
            IsSoldSeparately = false,
            Warranty = "month",
            CategoryId = 1,
            Condition = Condition.New,
            Notice = notice
        });

        return notice;
    }

     public static NoticeRequest CreateNoticeRequest()
    {
        return new NoticeRequest()
        {
            Title = "test title",
            UserId = 1,
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
                    SoldStatus = SoldStatus.Available,
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

    public static NoticeResponse CreateNoticeResponse()

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
                    SoldStatus = SoldStatus.Available,
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

    public static ControllerBase CreateFakeClaims(this ControllerBase controller)
    {
        var fakeClaims = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, "authId"),
            new Claim("RoleId", "1"),
            new Claim("UserName", "John")
        };

        var fakeIdentity = new ClaimsIdentity(fakeClaims, "TestAuthType");
        var fakeClaimsPrincipal = new ClaimsPrincipal(fakeIdentity);

        controller.ControllerContext.HttpContext = new DefaultHttpContext
        {
            User = fakeClaimsPrincipal 
        };

        return controller;
    }
}
