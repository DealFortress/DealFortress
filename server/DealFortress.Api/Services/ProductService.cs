
using DealFortress.Api.Models;

namespace DealFortress.Api.Services
{
    public class ProductsService
    {
        public ProductResponse ToProductResponse(Product product)
        {
          return new ProductResponse()
          {
            Id = product.Id,
            Name =product.Name,
            Price = product.Price,
            HasReceipt = product.HasReceipt,
            Warranty = product.Warranty,
            CategoryId = product.CategoryId,
            CategoryName = product.CategoryName,
            Condition = product.Condition,
            ImageIds = product.Images.Select(image => image.Id).ToList(),
            NoticeId = product.Notice.Id,
            NoticeCity = product.Notice.City,
            NoticeDeliveryMethod = product.Notice.DeliveryMethod,
            NoticePayment = product.Notice.Payment
          };
        }
        public Product ToProduct(ProductRequest request, Notice Notice)
        {
            var images = request.Images.Select(image => new Image{Url = image.Url, Description = image.Description}).ToList();

            return new Product()
            {
                Name = request.Name,
                Price = request.Price,
                HasReceipt = request.HasReceipt,
                Warranty = request.Warranty,
                Images = images,
                CategoryId = request.CategoryId,
                CategoryName = "Not implemented",
                Condition = request.Condition,
                IsSold = false,
                IsSoldSeparately =false,
                Notice = Notice
            };
        }
    }
}
