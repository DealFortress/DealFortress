using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.DTO;
using DealFortress.Modules.Categories.Core.Services;
using Moq;

namespace DealFortress.Modules.Categories.Tests.Unit;

public class ServicesTestsSad
{
    private readonly ICategoriesService _service;
    private readonly Mock<ICategoriesRepository> _repo;
    private readonly CategoryRequest _request;
    private readonly CategoryResponse _response;

    public ServicesTestsSad()
    {
        _repo = new Mock<ICategoriesRepository>();
        
        _service = new CategoriesService(_repo.Object);

        _request = new CategoryRequest(){ Name = "test" };

        _response = new CategoryResponse(){ Name = "test" };
    }

    [Fact]
    public void Test1()
    {

    }
}