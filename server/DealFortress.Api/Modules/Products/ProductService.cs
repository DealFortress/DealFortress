
using DealFortress.Api.Categories;
using DealFortress.Api.Notices;

namespace DealFortress.Api.Products
{
    public class ProductsService
    {
        public ProductResponse ToProductResponse(Product product, Category category)
        {
          return new ProductResponse()
          {
            Id = product.Id,
            Name =product.Name,
            Price = product.Price,
            HasReceipt = product.HasReceipt,
            Warranty = product.Warranty,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
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
                IsSoldSeparately =false,
                Notice = Notice
            };
        }
    }
}
