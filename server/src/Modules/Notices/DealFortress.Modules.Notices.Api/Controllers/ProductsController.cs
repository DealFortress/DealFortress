using Microsoft.AspNetCore.Mvc;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Microsoft.AspNetCore.Http;

namespace DealFortress.Modules.Notices.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private ProductsService _service;

    public ProductsController(ProductsService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ProductResponse>> GetProducts()
    {
        return Ok(_service.GetAllDTO());
    }

    [HttpPut("{id}")]
    public IActionResult PutProduct(int id, ProductRequest request)
    {
        var response = _service.PutDTOById(id, request);

        return response is null ? NotFound() : NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id)
    {
        var product = _service.DeleteById(id);

        return product is null ? NotFound() : NoContent();

    }
}