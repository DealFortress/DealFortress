using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Categories;

namespace DealFortress.Api.Notices
{
    public static class NoticesService
    {
        public static NoticeResponse ToNoticeResponse(Notice Notice)
        {
            var response = new NoticeResponse()
            {
                Id = Notice.Id,
                Title = Notice.Title,
                Description = Notice.Description,
                City = Notice.City,
                Payments = Notice.Payment.Split(","),
                DeliveryMethods = Notice.DeliveryMethod.Split(","),
                CreatedAt = Notice.CreatedAt,
                Products = Notice.Products.Select(product => ProductsService.ToProductResponse(product)).ToList()
            };


            return response;
        }

        public static Notice ToNotice(NoticeRequest request)
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
