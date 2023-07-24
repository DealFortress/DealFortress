using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Api.Modules.Notices;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private IProductsRepository _repo;
    private ProductsService _service;

    public ProductsController(IProductsRepository repository, ProductsService service)
    {
        _repo = repository;
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ProductResponse>> GetProducts()
    {
        var productsWithProducts = _repo.GetAllWithEverything();
        var productsResponse = productsWithProducts.Select(product => _service.ToProductResponseDTO(product)).ToList();
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
        var updatedproduct = _service.ToProduct(request, product.Notice);
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
}
