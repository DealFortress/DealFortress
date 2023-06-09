using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Repositories
{
    public class ProductsRepository: Repository<Product>, IProductsRepository
    {
        public ProductsRepository(DealFortressContext context) : base(context)
        {

        }
        
        public IEnumerable<Product> GetAllWithEverything()
        {
            return DealFortressContext.Products
                            .Include(product => (product.Category!))
                            .Include(product => product.Images)
                            .Include(product => product.Notice)
                            .ToList();
        }

        public Product? GetByIdWithEverything(int id)
        {
            return DealFortressContext.Products
                            .Include(product => (product.Category!))
                            .Include(product => product.Images)
                            .Include(product => product.Notice)
                            .FirstOrDefault();
        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}