using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public class ProductsService: IProductsService
{
    private readonly IProductsRepository _repo;
    private readonly CategoriesController _categoriesController;
    private readonly IImagesService _imagesService;



    public ProductsService(IProductsRepository repo, CategoriesController categoriesController, IImagesService imagesService)
    {
        _repo = repo;
        _categoriesController = categoriesController;
        _imagesService = imagesService;
    }


    public IEnumerable<ProductResponse> GetAll()
    {
        return _repo.GetAllWithImages()
                    .Select(product => ToProductResponseDTO(product))
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


    
    public ProductResponse ToProductResponseDTO(Product product)
    {
        return new ProductResponse()
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            HasReceipt = product.HasReceipt,
            Warranty = product.Warranty,
            CategoryId = product.CategoryId,
            CategoryName = GetCategoryNameById(product.CategoryId),
            Condition = product.Condition,
            Images = product.Images?.Select(image => _imagesService.ToImageResponseDTO(image)).ToList(),
            NoticeId = product.Notice.Id,
            IsSoldSeparately = product.IsSoldSeparately
        };
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

        product.Images = request.ImageRequests.Select(image => _imagesService.ToImage(image, product)).ToList();

        return product;
    }
    
    private string GetCategoryNameById(int id)
    {
        var categoryName = _categoriesController.GetCategoryNameById(id);

        if(categoryName is null)
        {
            return string.Empty;
        }

        return categoryName;
    }
}
