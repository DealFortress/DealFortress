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
            CreateImageMaps();  
        } 

        private void CreateProductMaps() {    
            CreateMap<Product, ProductResponse>();
            CreateMap<ProductRequest, Product>();
        }

        private void CreateNoticeMaps() {
            CreateMap<Notice, NoticeResponse>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => src.Payments.Split(",", System.StringSplitOptions.None)))
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => src.DeliveryMethods.Split(",", System.StringSplitOptions.None)));
  
            CreateMap<NoticeRequest, Notice>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => string.Join(",", src.Payments)))
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => string.Join(",", src.DeliveryMethods)));
        }

        private void CreateImageMaps() {

            CreateMap<Image, ImageResponse>();
            CreateMap<ImageRequest, Image>();
        }
    }
}