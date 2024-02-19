using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace Abstractions.Automapper
{
    public class AutoMappingNoticeProfiles : Profile
    {
        public AutoMappingNoticeProfiles () {
            CreateMap<Notice, NoticeResponse>();
            CreateMap<NoticeRequest, Notice>();
            CreateMap<Product, ProductResponse>();
            CreateMap<ProductRequest, Product>();
        }
    }
}