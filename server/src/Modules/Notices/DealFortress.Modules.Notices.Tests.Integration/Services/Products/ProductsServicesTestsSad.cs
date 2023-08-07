// using Moq;
// using FluentAssertions;
// using DealFortress.Modules.Notices.Core.DTO;
// using DealFortress.Modules.Notices.Core.Services;
// using DealFortress.Modules.Notices.Tests.Integration.Fixture;
// using DealFortress.Modules.Notices.Core.DAL.Repositories;
// using DealFortress.Modules.Notices.Core.Domain.Services;
// using DealFortress.Modules.Notices.Core.Domain.Repositories;
// using DealFortress.Modules.Notices.Core.Domain.Entities;
// using DealFortress.Modules.Categories.Api.Controllers;

// namespace DealFortress.Modules.Notices.Tests.Integration;

// public class CategoriessServicesTestsSad : IClassFixture<NoticesFixture>
// {
//     private readonly IProductsService _service;
//     private readonly IProductsRepository _repo;
//     private readonly ProductRequest _request;
//     public NoticesFixture Fixture;

//     public CategoriessServicesTestsSad(NoticesFixture fixture)
//     {
//         Fixture = fixture;
//         Fixture.Initialize();

//         _repo = new ProductsRepository(Fixture.Context);

//         var categoriesController = new Mock<CategoriesController>();

//         _service = new ProductsService(_repo, categoriesController.Object);

//         _request = new ProductRequest
//         {
//              Name = "test",
//             Price = 1,
//             HasReceipt = true,
//             IsSold = false,
//             IsSoldSeparately = false,
//             Warranty = "month",
//             CategoryId = 1,
//             Condition = Condition.New
//         };
//     }
// }