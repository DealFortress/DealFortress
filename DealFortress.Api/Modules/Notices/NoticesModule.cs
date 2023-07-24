.Modules.Categories;

namespace DealFortress.Api.Modules.Notices
{
    public class NoticesModule
    {
        public NoticesController NoticeController;
        public ProductsController ProductController;

        public NoticesModule(NoticesContext context, IProductsRepository productRepo, INoticesRepository noticeRepo, CategoriesModule categoriesModule, ProductsService productsService, NoticesService noticesService)
        {
            ProductController = new ProductsController(productRepo, productsService);

            NoticeController = new NoticesController(noticeRepo, noticesService);
        }
    }
}