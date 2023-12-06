using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Users.Api.Controllers;

namespace DealFortress.Modules.Notices.Core.Services;

public class ProductsService: IProductsService
{
    private readonly IProductsRepository _repo;
    private readonly IImagesService _imagesService;
    private UsersController _usersController;


    public ProductsService(IProductsRepository repo, IImagesService imagesService, UsersController usersController)
    {
        _repo = repo;
        _imagesService = imagesService;
        _usersController = usersController;
    }


    public IEnumerable<ProductResponse> GetAll()
    {
        return _repo.GetAll()
                    .Select(ToProductResponseDTO)
                    .ToList();
    }

    public ProductResponse? PutById(int id, ProductRequest request)
    {
        var product = _repo.GetById(id);

        if (product is null)
        {
            return null;
        }

        _repo.Remove(product);
        var updatedProduct = ToProduct(request, product.Notice);
        updatedProduct.Id = product.Id;

        _repo.Add(updatedProduct);
        _repo.Complete();


        return ToProductResponseDTO(updatedProduct);
    }

    public Product? DeleteById(int id)
    {
        var product = _repo.GetById(id);

        if (product is null)
        {
            return null;
        }

        _repo.Remove(product);
        _repo.Complete();

        return product;
    }

    public ProductResponse? PatchSoldStatusById(int id, SoldStatus soldStatus)
    {
        var product = _repo.GetById(id);
        

        if (product is null)
        {
            return null;
        }
        
        var isCreator = _usersController.IsUserNoticeCreator(product.Notice.UserId);

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