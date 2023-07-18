using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Api.Modules.Notices;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private ProductsRepository _repo;

    public ProductsController(ProductsRepository repository)
    {
        _repo = repository;
    }


    [HttpGet]
    public ActionResult<IEnumerable<ProductResponse>> GetProducts()
    {
        var productsWithProducts = _repo.GetAllWithEverything();
        var productsResponse = productsWithProducts.Select(product => ProductsService.ToProductResponseDTO(product)).ToList();
        return Ok(productsResponse);
    }

    [HttpPut("{id}")]
    public IActionResult PutProduct(int id, ProductRequest request)
    {
        var product = _repo.GetByIdWithEverything(id);

        if (product == null)
        {
            return NotFound();
        }

        _repo.Remove(product);
        var updatedproduct = ProductsService.ToProduct(request, product.Notice);
        updatedproduct.Id = product.Id;

        _repo.Add(updatedproduct);
        _repo.Complete();


        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id)
    {
        var product = _repo.GetById(id);

        if (product == null)
        {
            return NotFound();
        }

        _repo.Remove(product);
        _repo.Complete();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _repo.GetAll().Any(e => e.Id == id);
    }
}
