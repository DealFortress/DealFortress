using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using DealFortress.Modules.Categories.Tests.Integration.Fixture;
using FluentAssertions;

namespace DealFortress.Modules.Categories.Tests.Integration;

public class CategoriesServicesTestsSad : IClassFixture<CategoriesFixture>
{
    private readonly ICategoriesService _service;
    private readonly CategoriesRepository _repo;
    public CategoriesFixture Fixture;

    public CategoriesServicesTestsSad(CategoriesFixture fixture)
    {
        Fixture = fixture;
        Fixture.Initialize();
        
        _repo = new CategoriesRepository(Fixture.Context);

        _service = new CategoriesService(_repo);
    }

    [Fact]
    public void GetAllDTO_should_return_all_notices()
    {
        // Act
        var noticeResponses = _service.GetDTOById(-1);

        // Assert 
        noticeResponses.Should().Be(null);
    }
}