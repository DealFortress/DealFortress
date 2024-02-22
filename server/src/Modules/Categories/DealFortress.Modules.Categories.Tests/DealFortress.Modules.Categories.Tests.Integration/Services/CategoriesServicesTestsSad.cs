using AutoMapper;
using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Tests.Integration.Fixture;
using DealFortress.Modules.Categories.Tests.Shared;
using FluentAssertions;

namespace DealFortress.Modules.Categories.Tests.Integration;

public class CategoriesServicesTestsSad : IClassFixture<CategoriesFixture>
{
    private readonly ICategoriesService _service;
    private readonly CategoriesRepository _repo;
    public CategoriesFixture Fixture;
    private readonly IMapper _mapper;

    public CategoriesServicesTestsSad(CategoriesFixture fixture)
    {
        Fixture = fixture;
        Fixture.Initialize();
        _mapper = CategoriesTestModels.CreateMapper();
        
        _repo = new CategoriesRepository(Fixture.Context);

        _service = new CategoriesService(_repo, _mapper);
    }

    [Fact]
    public async void GetAll_should_return_all_notices()
    {
        // Act
        var noticeResponses = await _service.GetByIdAsync(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }
}