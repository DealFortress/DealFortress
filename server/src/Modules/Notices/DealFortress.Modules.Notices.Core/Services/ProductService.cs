using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.DTO;
namespace DealFortress.Modules.Notices.Core.Services;

public class ProductsService
{
    private readonly IProductsRepository _repo;

        private readonly INoticesRepository _noticesRepo;
    public ProductsService(IProductsRepository repo, INoticesRepository noticesRepository)
    {
        _repo = repo;
        _noticesRepo = noticesRepository;
    }


    public IEnumerable<ProductResponse> GetAllDTO()
    {
        return _repo.GetAll()
                    .Select(product => ToProductResponseDTO(product));
    }

      public ProductResponse? PutDTOById(int id, ProductRequest request)
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
    { // check that products get deleted as well
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
            ImageUrls = new List<string>() { "" },
            CategoryName = "CPU",
            Condition = product.Condition,
            NoticeId = product.Notice.Id,
            NoticeCity = product.Notice.City,
            NoticeDeliveryMethod = product.Notice.DeliveryMethod,
            NoticePayment = product.Notice.Payment
        };
    }
    public Product ToProduct(ProductRequest request, Notice Notice)
    {
        return new Product()
        {
            Name = request.Name,
            Price = request.Price,
            HasReceipt = request.HasReceipt,
            Warranty = request.Warranty,
            CategoryId = request.CategoryId,
            Condition = request.Condition,
            IsSold = false,
            IsSoldSeparately = false,
            Notice = Notice
        };
    }
    
    // private string GetCategoryNameById(int id)
    // {
    //     var categoryResponse = _categoriesModule.Controller.GetCategory(id);

    //     if(categoryResponse.Value is null)
    //     {
    //         return string.Empty;
    //     }

    //     return categoryResponse.Value.Name;
    // }
}
