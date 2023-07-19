using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DealFortress.Api.Data;

namespace DealFortress.Api.Modules.Notices
{
    public class NoticesModule
    {
        public NoticesController NoticeController;
        public ProductsController ProductController;

        public NoticesModule(NoticesContext context, IProductsRepository productRepo, INoticesRepository noticeRepo)
        {
            NoticeController = new NoticesController(noticeRepo);
            ProductController = new ProductsController(productRepo);
        }
    }
}