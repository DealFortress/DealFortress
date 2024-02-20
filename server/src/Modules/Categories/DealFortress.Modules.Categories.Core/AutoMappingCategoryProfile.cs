using AutoMapper;

using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.DTO;

namespace DealFortress.Modules.Categories.Core
{
    public class AutoMappingCategoryProfile
    {
        public AutoMappingCategoryProfile() {
            CreateMap<Category, CategoryResponse>();
        }
    }
}