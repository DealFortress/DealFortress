using Microsoft.AspNetCore.Mvc;
using DealFortress.Modules.Notices.Core.DTO;
using Microsoft.AspNetCore.Http;
using DealFortress.Modules.Notices.Core.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DealFortress.Modules.Notices.Core.Domain.Entities;

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

    [HttpPatch("{id}/soldstatus/{soldstatus}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult PatchProductSoldStatus(int id, SoldStatus soldStatus)
    {
        string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value;

        var response = _service.PatchSoldStatusById(id, soldStatus, userId);

        return response is null ? NotFound() : Ok(response);
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