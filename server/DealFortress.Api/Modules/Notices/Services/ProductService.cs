
using DealFortress.Api.Models;

namespace DealFortress.Api.Modules.Notices;
public static class ProductsService
{
    public static ProductResponse ToProductResponseDTO(Product product)
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
            CategoryName = product.CategoryName,
            Condition = product.Condition,
            NoticeId = product.Notice.Id,
            NoticeCity = product.Notice.City,
            NoticeDeliveryMethod = product.Notice.DeliveryMethod,
            NoticePayment = product.Notice.Payment
        };
    }
    public static Product ToProduct(ProductRequest request, Notice Notice)
    {
        return new Product()
        {
            Name = request.Name,
            Price = request.Price,
            HasReceipt = request.HasReceipt,
            Warranty = request.Warranty,
            CategoryId = request.CategoryId,
            CategoryName = "Not implemented",
            Condition = request.Condition,
            IsSold = false,
            IsSoldSeparately = false,
            Notice = Notice
        };
    }
}
