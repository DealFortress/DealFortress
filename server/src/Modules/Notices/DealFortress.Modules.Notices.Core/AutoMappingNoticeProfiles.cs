using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace Abstractions.Automapper
{
    public class AutoMappingNoticeProfiles : Profile
    {
        public AutoMappingNoticeProfiles () {
            CreateNoticeMaps();
           
            CreateProductMaps();  
        }

        private void CreateProductMaps() {
            CreateMap<Product, ProductResponse>()
                .IncludeMembers(src => src.Notice)
                .IncludeMembers(src => src.Images);
            CreateMap<ProductRequest, Product>()
                .IncludeMembers(src => src.ImageRequests);
        }
        private void CreateNoticeMaps() {
             CreateMap<Notice, NoticeResponse>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => src.Payments.Split(",", System.StringSplitOptions.None)) )
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => src.DeliveryMethods.Split(",", System.StringSplitOptions.None)) )
                .IncludeMembers(src => src.Products);
               

            CreateMap<NoticeRequest, Notice>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => string.Join(",", src.Payments)))
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => string.Join(",", src.DeliveryMethods)))
                .IncludeMembers(src => src.ProductRequests);
        }
    }
}