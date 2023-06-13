using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;

namespace DealFortress.Api.Services
{
    public class NoticeService
    {
        private readonly ProductService _productService;
        public NoticeService(ProductService productService)
        {
            _productService = productService; 
        }

        public NoticeResponse ToNoticeResponse(Notice Notice)
        {
            var response = new NoticeResponse()
            {
                Id = Notice.Id,
                Title = Notice.Title,
                Description = Notice.Description,
                City = Notice.City,
                Payment = Notice.Payment,
                DeliveryMethod = Notice.DeliveryMethod,
                CreatedAt = Notice.CreatedAt
            };

            if (Notice.Products is not null)
            {
                response.Products = Notice.Products.Select(product => _productService.ToProductResponse(product)).ToList();
            }

            return response;
        }

        public Notice ToNotice(NoticeRequest request)
        {
          return new Notice()
          {
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payment = request.Payment,
            Products = null,
            DeliveryMethod = request.DeliveryMethod,
            CreatedAt = DateTime.Now
          };
        }
    }
}