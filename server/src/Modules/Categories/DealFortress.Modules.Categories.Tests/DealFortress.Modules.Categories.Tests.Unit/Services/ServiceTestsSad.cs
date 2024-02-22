using AutoMapper;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Tests.Shared;
using FluentAssertions;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServiceTestsSad
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;
    private readonly IMapper _mapper;


    public ServiceTestsSad()
    {
        _mapper = CategoriesTestModels.CreateMapper();

        _repo = new Mock<ICategoriesRepository>();
        
        _service = new CategoriesService(_repo.Object, _mapper);
    }

    [Fact]
    public async void GetById_returns_null_when_id_doesnt_exist()
    {
        // arrange
        _repo.Setup(repo => repo.GetByIdAsync(1));

        // act
        var response = await _service.GetByIdAsync(1);

        // assert
        response.Should().Be(null);
    }
}