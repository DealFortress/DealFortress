using AutoMapper;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core
{
    public class AutoMappingCategoryProfiles : Profile
    {
        public AutoMappingCategoryProfiles() {
            CreateMap<Category, CategoryResponse>();
            CreateMap<CategoryRequest, Category>();
        }
    }
}