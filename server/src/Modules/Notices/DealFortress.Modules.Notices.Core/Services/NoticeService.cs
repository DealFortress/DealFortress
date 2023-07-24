using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

internal static class NoticesService
{
    // private readonly ProductsService _productsService;
    // public NoticesService(ProductsService productsService)
    // {
    //     _productsService = productsService;
    // }

    public static NoticeResponse ToNoticeResponseDTO(Notice Notice)
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
            response.Products = Notice.Products.Select(product => ProductsService.ToProductResponseDTO(product)).ToList();
        }

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

