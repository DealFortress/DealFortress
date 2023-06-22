using DealFortress.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Repositories
{
    public class ProductsRepository: Repository<Product>, IProductsRepository
    {
        public ProductsRepository(DealFortressContext context) : base(context)
        {

        }
        public IEnumerable<Product> GetAllWithProducts()
        {
            return  DealFortressContext.Products
                            .Include(product => (product.Category!))
                            .Include(product => product.Images)
                            .ToList();
        }

        public Product? GetByIdWithProducts(int id)
        {
            return DealFortressContext.Products
                            .Include(product => (product.Category!))
                            .Include(product => product.Images)
                        .FirstOrDefault(product => product.Id == id);
        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}