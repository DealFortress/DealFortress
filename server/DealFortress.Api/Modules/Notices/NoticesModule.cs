using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealFortress.Api.Modules.Notices
{
    public class NoticesModule
    {
        private readonly NoticesRepository _noticeRepo;
        public NoticesController NoticeController;

        private readonly ProductsRepository _productRepo;
        public ProductsController ProductController;
        
        public NoticesModule(DealFortressContext context)
        {
            _noticeRepo = new NoticesRepository(context);
            NoticeController = new NoticesController(_noticeRepo);

            _productRepo = new ProductsRepository(context);
            ProductController = new ProductsController(_productRepo);
        }
    }
}