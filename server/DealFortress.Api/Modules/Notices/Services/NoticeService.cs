using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Categories;

namespace DealFortress.Api.Notices
{
    public class NoticesService
    {
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
                CreatedAt = Notice.CreatedAt,
                Products = Notice.Products.Select(product => ToProductResponse(product)).ToList()
            };


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
