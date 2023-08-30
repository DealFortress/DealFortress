using Microsoft.AspNetCore.Mvc;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Modules.Notices.Core.Services;
using Microsoft.AspNetCore.Http;
using DealFortress.Modules.Notices.Core.Domain.Services;
using Microsoft.AspNetCore.Authorization;

namespace DealFortress.Modules.Notices.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private IProductsService _service;

    public ProductsController(IProductsService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<ProductResponse>> GetProducts()
    {
        return Ok(_service.GetAll());
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult PutProduct(int id, ProductRequest request)
    {
        var response = _service.PutById(id, request);

        return response is null ? NotFound() : NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteProduct(int id)
    {
        var product = _service.DeleteById(id);

        return product is null ? NotFound() : NoContent();

    }
}