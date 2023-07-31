using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class NoticesService
{
    private readonly ProductsService _productsService;
    private readonly INoticesRepository _repo;
    public NoticesService(ProductsService productsService, INoticesRepository repo)
    {
        _productsService = productsService;
        _repo = repo;
    }
    
    public IEnumerable<NoticeResponse> GetAllDTO()
    {
        return _repo.GetAllWithProducts()
                    .Select(notice => ToNoticeResponseDTO(notice));
    }

    public NoticeResponse? GetDTOById(int id)
    {
        var notice = _repo.GetByIdWithProducts(id);

        if (notice is null)
        {
            return null;
        }

        return ToNoticeResponseDTO(notice);
    } 

    public NoticeResponse? PutDTOById(int id, NoticeRequest request)
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

    public NoticeResponse PostDTO(NoticeRequest request)
    {
        var notice = ToNotice(request);

        _repo.Add(notice);

        _repo.Complete();

        return ToNoticeResponseDTO(notice);
    }

    public Notice? DeleteById(int id)
    { // check that products get deleted as well
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
            Title = Notice.Title,
            Description = Notice.Description,
            City = Notice.City,
            Payments = Notice.Payment.Split(","),
            DeliveryMethods = Notice.DeliveryMethod.Split(","),
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
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payment = string.Join(",", request.Payments),
            DeliveryMethod = string.Join(",", request.DeliveryMethods),
            CreatedAt = DateTime.UtcNow
        };

        if (request.ProductRequests is not null)
        {
            notice.Products = request.ProductRequests.Select(product => _productsService.ToProduct(product, notice)).ToList();
        }

        return notice;
    }
}

