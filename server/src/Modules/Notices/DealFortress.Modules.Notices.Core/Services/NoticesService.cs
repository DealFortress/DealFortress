using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class NoticesService : INoticesService
{
    private readonly IProductsService _productsService;
    private readonly INoticesRepository _repo;
    public NoticesService(IProductsService productsService, INoticesRepository repo)
    {
        _productsService = productsService;
        _repo = repo;
    }
    
    public IEnumerable<NoticeResponse> GetAll()
    {
        return _repo.GetAllWithProductsAndImages()
                    .Select(notice => ToNoticeResponseDTO(notice))
                    .ToList();
    }

    public NoticeResponse? GetById(int id)
    {
        var notice = _repo.GetByIdWithProducts(id);

        if (notice is null)
        {
            return null;
        }

        return ToNoticeResponseDTO(notice);
    } 

    public NoticeResponse? PutById(int id, NoticeRequest request)
    {
        var notice = _repo.GetById(id);

        if (notice is null)
        {
            return null;
        }

        _repo.Remove(notice);
        var updatedNotice = ToNotice(request);
        updatedNotice.Id = notice.Id;

        _repo.Add(updatedNotice);
        _repo.Complete();


        return ToNoticeResponseDTO(updatedNotice);
    }

    public NoticeResponse Post(NoticeRequest request)
    {
        var notice = ToNotice(request);

        _repo.Add(notice);

        _repo.Complete();

        return ToNoticeResponseDTO(notice);
    }

    public Notice? DeleteById(int id)
    {
        var notice = _repo.GetById(id);

        if (notice is null)
        {
            return null;
        }

        _repo.Remove(notice);
        _repo.Complete();

        return notice;
    }


    public NoticeResponse ToNoticeResponseDTO(Notice Notice)
    {
        var response = new NoticeResponse()
        {
            Id = Notice.Id,
            UserId = Notice.UserId,
            Title = Notice.Title,
            Description = Notice.Description,
            City = Notice.City,
            Payments = Notice.Payments.Split(","),
            DeliveryMethods = Notice.DeliveryMethods.Split(","),
            CreatedAt = Notice.CreatedAt
        };

        if (Notice.Products is not null)
        {
            response.Products = Notice.Products.Select(product => _productsService.ToProductResponseDTO(product)).ToList();
        }

        return response;
    }

    public Notice ToNotice(NoticeRequest request)
    {
        var notice = new Notice()
        {
            UserId = request.UserId,
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payments = string.Join(",", request.Payments),
            DeliveryMethods = string.Join(",", request.DeliveryMethods),
            CreatedAt = DateTime.UtcNow
        };

        if (request.ProductRequests is not null)
        {
            notice.Products = request.ProductRequests.Select(product => _productsService.ToProduct(product, notice)).ToList();
        }

        return notice;
    }
}

