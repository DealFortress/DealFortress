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
            
            CreateMap<Product, ProductResponse>()
                .IncludeMembers(src => src.Notice, src => src.Images)
                .ForMember(dest => dest.NoticeId,
                opt => opt.MapFrom(src => src.Notice.Id))
                .ForMember(dest => dest.ImageResponses,
                opt => opt.MapFrom(src => src.Images))
                .ReverseMap();

            CreateMap<ProductRequest, Product>()
                .IncludeMembers(src => src.ImageRequests)
                .ForMember(dest => dest.Images,
                opt => opt.MapFrom(src => src.ImageRequests))
                .ReverseMap();

            CreateMap<Product, NoticeResponse>();
            CreateMap<IEnumerable<Product>, NoticeResponse>();
            CreateMap<IEnumerable<ProductRequest>, Notice>();
        }
        private void CreateNoticeMaps() {
            CreateMap<Notice, NoticeResponse>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => src.Payments.Split(",", System.StringSplitOptions.None)))
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => src.DeliveryMethods.Split(",", System.StringSplitOptions.None)))
                .ForMember(dest => dest.ProductResponses,
                opt => opt.MapFrom(src => src.Products))
                .ReverseMap();

            CreateMap<Notice, ProductResponse>();
  

            CreateMap<NoticeRequest, Notice>()
                .ForMember(dest => dest.Payments,
                opt => opt.MapFrom(src => string.Join(",", src.Payments)))
                .ForMember(dest => dest.DeliveryMethods,
                opt => opt.MapFrom(src => string.Join(",", src.DeliveryMethods)))
                .ForMember(dest => dest.Products,
                opt => opt.MapFrom(src => src.ProductRequests))
                .ReverseMap();
        }

        private void CreateImageMaps() {

            CreateMap<Image, ImageResponse>();
            CreateMap<ImageRequest, Image>();
            CreateMap<IEnumerable<Image>, ProductResponse>();
            CreateMap<IEnumerable<ImageRequest>,Product>();
        }
    }
}