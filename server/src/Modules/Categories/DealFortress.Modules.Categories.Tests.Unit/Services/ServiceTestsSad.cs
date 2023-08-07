using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using FluentAssertions;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServiceTestsSad
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;

    public ServiceTestsSad()
    {
        _repo = new Mock<ICategoriesRepository>();
        
        _service = new CategoriesService(_repo.Object);
    }

    [Fact]
    public void GetById_returns_null_when_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetById(1));

        // act
        var response = _service.GetById(1);

        // assert
        response.Should().Be(null);
    }
}