using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Models;

namespace DealFortress.Api.Services
{
    public class NoticesService
    {
        private readonly ProductsService _productsService;
        public NoticesService(ProductsService productsService)
        {
            _productsService = productsService;
        }

        public NoticeResponse ToNoticeResponse(Notice Notice)
        {
            var response = new NoticeResponse()
            {
                Id = Notice.Id,
                Title = Notice.Title,
                Description = Notice.Description,
                City = Notice.City,
                Payments = Notice.Payment.Split(","),
                DeliveryMethods = Notice.DeliveryMethod.Split(","),
                CreatedAt = Notice.CreatedAt
            };

            if (Notice.Products is not null)
            {
                response.Products = Notice.Products.Select(product => _productsService.ToProductResponse(product)).ToList();
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
            Payment = string.Join(",", request.Payments),
            Products = null,
            DeliveryMethod = string.Join(",", request.DeliveryMethods),
            CreatedAt = DateTime.UtcNow
          };
        }
    }
}
