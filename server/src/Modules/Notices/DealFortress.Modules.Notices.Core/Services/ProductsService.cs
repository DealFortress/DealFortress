using AutoMapper;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Services;

public class ProductsService: IProductsService
{
    private readonly IProductsRepository _repo;
    private UsersController _usersController;
    private readonly IMapper _mapper;


    public ProductsService(IProductsRepository repo, UsersController usersController, IMapper mapper)
    {
        _repo = repo;
        _usersController = usersController;
        _mapper = mapper;
    }


    public PaginatedList<ProductResponse> GetAllPaginated(int? noticeId, int pageIndex, int pageSize)
    {
        var paginatedList = _repo.GetAllPaginated(noticeId, pageIndex, pageSize);
                    
        var paginatedResponse = PaginatedList<ProductResponse>
            .Create<Product>(paginatedList.Entities, pageIndex, pageSize, _mapper);     

        return paginatedResponse;
    }

    public async Task<ProductResponse?> PutByIdAsync(int id, ProductRequest request)
    {
        var product = await _repo.GetByIdAsync(id);

        if (product is null)
        {
            return null;
        }
               
        var isCreator = await _usersController.IsUserEntityCreatorAsync(product.Notice.UserId);

        if (!isCreator)
        {
            return null;
        }

        _repo.Remove(product);
<<<<<<< HEAD
        var updatedProduct = _mapper.Map<Product>(request);
=======
        var updatedProduct = _mapper.Map<ProductRequest, Product>(request);
>>>>>>> 91146aa41879127b0397d7d544c209a3d7582032
        updatedProduct.Id = product.Id;

        await _repo.AddAsync(updatedProduct);
        _repo.Complete();

<<<<<<< HEAD
        return _mapper.Map<ProductResponse>(updatedProduct);
=======

        return _mapper.Map<Product, ProductResponse>(updatedProduct);
>>>>>>> 91146aa41879127b0397d7d544c209a3d7582032
    }

    public async Task<Product?> DeleteByIdAsync(int id)
    {
        var product = await _repo.GetByIdAsync(id);

        if (product is null)
        {
            return null;
        }
               
        var isCreator = await _usersController.IsUserEntityCreatorAsync(product.Notice.UserId);

        if (!isCreator)
        {
            return null;
        }

        _repo.Remove(product);
        _repo.Complete();

        return product;
    }

    public async Task<ProductResponse?> PatchSoldStatusByIdAsync(int id, SoldStatus soldStatus)
    {
        var product = await _repo.GetByIdAsync(id);
        
        if (product is null)
        {
            return null;
        }
        
        var isCreator = await _usersController.IsUserEntityCreatorAsync(product.Notice.UserId);

        if (!isCreator)
        {
            return null;
        }

        product.SoldStatus = soldStatus;

        _repo.Update(product);
        _repo.Complete();

        return _mapper.Map<Product, ProductResponse>(product);
    }


}