using AutoMapper;
using DealFortress.Modules.Categories.Core;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;


namespace DealFortress.Modules.Categories.Tests.Shared;

public static class CategoriesTestModels
{
    
    public static IMapper CreateMapper(){
        var mockMapper = new MapperConfiguration(cfg => {
            cfg.AddProfile(new AutoMappingCategoryProfiles());
        });
        return mockMapper.CreateMapper();
    }

    public static Category CreateCategory()
    {
        return new Category() { Id = 1, Name = "test" };
    }

     public static CategoryRequest CreateCategoryRequest()
    {
       return new CategoryRequest() { Name = "test" };
    }

    public static CategoryResponse CreateCategoryResponse()
    {
        return new CategoryResponse(){ Name = "test" };
    }

}
