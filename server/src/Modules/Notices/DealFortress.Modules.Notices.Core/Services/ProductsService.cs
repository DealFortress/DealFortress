using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class ProductsService: IProductsService
{
    private readonly IProductsRepository _repo;
    private readonly IImagesService _imagesService;



    public ProductsService(IProductsRepository repo, IImagesService imagesService)
    {
        _repo = repo;
        _imagesService = imagesService;
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

    public ProductResponse? PatchSoldStatusById(int id)
    {
        var product = _repo.GetById(id);

        if (product is null)
        {
            return null;
        }

        product.IsSold = !product.IsSold;

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
            IsSold = product.IsSold,
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
            IsSold = false,
            IsSoldSeparately = false,
            Notice = notice,
        };

        if (product.Images is not null)
        {
            product.Images = request.ImageRequests.Select(image => _imagesService.ToImage(image, product)).ToList();
        }
        return product;
    }
}
