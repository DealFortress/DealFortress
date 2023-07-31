using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Services;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ControllersTestsHappy
{
    private readonly CategoriesService _service;
    private readonly CategoriesController _controller;

    public ControllersTestsHappy()
    {
        var category = new Category()
        {
            Id = 1,
            Name = "test"
        };
        var repo = new Mock<ICategoriesRepository>();
        repo.Setup(item => item.GetById(It.IsAny<int>())).Returns(category);
        _service = new CategoriesService(repo.Object);
        _controller = new CategoriesController(_service);
    }
    
    [Fact]
    public void get_all_returns_ok()
    {
        var dto = _service.GetDTOById(1);
        dto.

    }
}