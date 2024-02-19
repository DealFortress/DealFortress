using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Services;

public class NoticesService : INoticesService
{
    private readonly IProductsService _productsService;
    private readonly INoticesRepository _repo;
    private readonly UsersController _usersController;
    private readonly IMapper _mapper;
    public NoticesService(IMapper mapper, IProductsService productsService, INoticesRepository repo, UsersController usersController)
    {
        _usersController = usersController;
        _productsService = productsService;
        _repo = repo;
        _mapper = mapper;
    }
    
    public PaginatedList<NoticeResponse> GetAllPaginated(int? userId, int pageIndex, int pageSize)
    {
        var paginatedList = _repo.GetAllPaginated(userId, pageIndex, pageSize);
                    
        var paginatedResponse = PaginatedList<NoticeResponse>
            .Create<Notice>(paginatedList.Entities, pageIndex, pageSize, _mapper);     

        return paginatedResponse;
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

        var isCreator = await _usersController.IsUserEntityCreatorAsync(notice.UserId);

        if (!isCreator)
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

        var isCreator = await _usersController.IsUserEntityCreatorAsync(notice.UserId);

        if (!isCreator)
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
            notice.Products = request.ProductRequests.Select(productRequest => _productsService.ToProduct(productRequest, notice)).ToList();
        }
        
        return notice;
    }


}

