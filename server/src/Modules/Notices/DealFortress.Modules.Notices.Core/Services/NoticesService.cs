using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Modules.Users.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Services;

public class NoticesService : INoticesService
{
    private readonly INoticesRepository _repo;
    private readonly UsersController _usersController;
    private readonly IMapper _mapper;
    public NoticesService(INoticesRepository repo, UsersController usersController, IMapper mapper)
    {
        _usersController = usersController;
        _repo = repo;
        _mapper = mapper;
    }
    
    public PaginatedList<NoticeResponse> GetAllPaginated(PaginatedParams param)
    {

        var paginatedList = _repo.GetAllPaginated(param);
                    
        var paginatedResponse = PaginatedList<NoticeResponse>
            .Create<Notice>(paginatedList.Entities, param.PageIndex, param.PageSize, _mapper);     

        return paginatedResponse;
    }


    public async Task<NoticeResponse?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);

        if (entity is null)
        {
            return null;
        }

        return _mapper.Map<Notice, NoticeResponse>(entity);
    } 

    public async Task<NoticeResponse?> PutByIdAsync(int id, NoticeRequest request)
    {
        var entity = await _repo.GetByIdAsync(id);

        if (entity is null)
        {
            return null;
        }

        var isCreator = await _usersController.IsUserEntityCreatorAsync(entity.UserId);

        if (!isCreator)
        {
            return null;
        }

        _repo.Remove(entity);
        var updatedNotice = _mapper.Map<NoticeRequest, Notice>(request);
        updatedNotice.Id = entity.Id;

        await _repo.AddAsync(updatedNotice);
        _repo.Complete();


        return _mapper.Map<Notice, NoticeResponse>(updatedNotice);
    }

    public async Task<NoticeResponse> PostAsync(NoticeRequest request)
    {
        var notice = _mapper.Map<NoticeRequest, Notice>(request);

        await _repo.AddAsync(notice);

        _repo.Complete();

        return _mapper.Map<Notice, NoticeResponse>(notice);
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
}

