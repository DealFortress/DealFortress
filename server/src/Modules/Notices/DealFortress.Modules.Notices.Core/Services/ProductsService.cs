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
    private readonly IImagesService _imagesService;
    private readonly UsersController _usersController;
    private readonly IMapper _mapper;


    public ProductsService(IMapper _mapper, IProductsRepository repo, IImagesService imagesService, UsersController usersController)
    {
        _repo = repo;
        _imagesService = imagesService;
        _usersController = usersController;
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
        var updatedProduct = _mapper.Map<Product>(request);
        updatedProduct.Id = product.Id;

        await _repo.AddAsync(updatedProduct);
        _repo.Complete();

        return _mapper.Map<ProductResponse>(updatedProduct);
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

        return ToProductResponseDTO(product);
    }
    
    public ProductResponse ToProductResponseDTO(Product product)
    {
        var response = new ProductResponse()
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            HasReceipt = product.HasReceipt,
            Warranty = product.Warranty,
            CategoryId = product.CategoryId,
            Condition = product.Condition,
            SoldStatus = product.SoldStatus,
            NoticeId = product.Notice.Id,
            IsSoldSeparately = product.IsSoldSeparately
        };

        if (product.Images is not null)
        {
            response.Images = product.Images?.Select(_imagesService.ToImageResponseDTO).ToList();
        }

        return response;
    }

    public Product ToProduct(ProductRequest request, Notice notice)
    {
        var product = new Product()
        {
            Name = request.Name,
            Price = request.Price,
            HasReceipt = request.HasReceipt,
            Warranty = request.Warranty,
            CategoryId = request.CategoryId,
            Condition = request.Condition,
            SoldStatus = request.SoldStatus,
            IsSoldSeparately = false,
            Notice = notice,
            Images = new List<Image>()
        };

        product.Images = request.ImageRequests.Select(image => _imagesService.ToImage(image, product)).ToList();
        
        return product;
    }


}