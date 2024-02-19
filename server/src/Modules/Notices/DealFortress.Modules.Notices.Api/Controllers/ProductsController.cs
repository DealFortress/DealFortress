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
    public ActionResult<IEnumerable<ProductResponse>> GetProducts(int? noticeId, int pageIndex = 0, int pageSize = 20)
    {
        return Ok(_service.GetAllPaginated(noticeId, pageIndex, pageSize));
    }

    [HttpPatch("{id}/soldstatus/{soldstatus}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PatchProductSoldStatusAsync(int id, SoldStatus soldStatus)
    {
        var response = await _service.PatchSoldStatusByIdAsync(id, soldStatus);

        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProductAsync(int id)
    {
        var product = await _service.DeleteByIdAsync(id);

        return product is null ? NotFound() : NoContent();
    }
}