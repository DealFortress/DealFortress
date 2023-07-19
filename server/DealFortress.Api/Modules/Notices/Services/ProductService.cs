
using DealFortress.Api.Modules.Categories;

namespace DealFortress.Api.Modules.Notices;
public class ProductsService
{
    private readonly CategoriesModule _categoriesModule;
    public ProductsService(CategoriesModule categoriesModule)
    {
        _categoriesModule = categoriesModule;
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
            CategoryName = GetCategoryNameById(product.CategoryId),
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
    
    private string GetCategoryNameById(int id)
    {
        var categoryResponse = _categoriesModule.Controller.GetCategory(id);

        if(categoryResponse.Value is null)
        {
            return string.Empty;
        }

        return categoryResponse.Value.Name;
    }
}
