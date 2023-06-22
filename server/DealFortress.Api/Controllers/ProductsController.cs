using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;
using DealFortress.Api.Services;
using DealFortress.Api.UnitOfWork;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ProductsService _productsService;

        public ProductsController(IUnitOfWork unitOfWork, ProductsService productsService)
        {
            _productsService = productsService;
            _unitOfWork = unitOfWork;
        }


        [HttpGet]
        public ActionResult<IEnumerable<ProductResponse>> GetProducts()
        {
            return Ok(_unitOfWork.Products.GetAllWithEverything());
        }

        [HttpPut("{id}")]
        public IActionResult PutProduct(int id, ProductRequest request)
        {
            var product = _unitOfWork.Products.GetById(id);

            if(product == null)
            {
                return NotFound();
            }

            _unitOfWork.Products.Remove(product);
            var updatedproduct = _productsService.ToProduct(product.Category, request, product.Notice);
            updatedproduct.Id = product.Id;

            _unitOfWork.Products.Add(updatedproduct);
            _unitOfWork.Complete();


            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
