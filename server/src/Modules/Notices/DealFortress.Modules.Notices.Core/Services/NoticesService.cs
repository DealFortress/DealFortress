using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using NuGet.Common;

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
    
    public async Task<IEnumerable<NoticeResponse>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        
        return entities
                .Select(ToNoticeResponseDTO)
                .ToList();
    }

    public async Task<NoticeResponse?> GetByIdAsync(int id)
    {
        var notice = await _repo.GetByIdAsync(id);

        if (notice is null)
        {
            return null;
        }

        return ToNoticeResponseDTO(notice);
    } 

    public async Task<NoticeResponse?> PutByIdAsync(int id, NoticeRequest request)
    {
        var notice = await _repo.GetByIdAsync(id);

        if (notice is null)
        {
            return null;
        }

        _repo.Remove(notice);
        var updatedNotice = ToNotice(request);
        updatedNotice.Id = notice.Id;

        await _repo.AddAsync(updatedNotice);
        _repo.Complete();


        return ToNoticeResponseDTO(updatedNotice);
    }

    public async Task<NoticeResponse> PostAsync(NoticeRequest request)
    {
        var notice = ToNotice(request);

        await _repo.AddAsync(notice);

        _repo.Complete();

        return ToNoticeResponseDTO(notice);
    }

    public async Task<Notice?> DeleteByIdAsync(int id)
    {
        var notice = await _repo.GetByIdAsync(id);

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
        
        var creationDate = DateTime.UtcNow;
        if (request.CreatedAt is DateTime) 
        {
            creationDate = (DateTime)request.CreatedAt;
        } 

        var notice = new Notice()
        {
            UserId = request.UserId,
            Title = request.Title,
            Description = request.Description,
            City = request.City,
            Payments = string.Join(",", request.Payments),
            DeliveryMethods = string.Join(",", request.DeliveryMethods),
            CreatedAt = creationDate,
            Products = new List<Product>()
        };

        if (request.ProductRequests is not null)
        {
            notice.Products = request.ProductRequests.Select(product => _productsService.ToProduct(product, notice)).ToList();
        }
        
        return notice;
    }
}

