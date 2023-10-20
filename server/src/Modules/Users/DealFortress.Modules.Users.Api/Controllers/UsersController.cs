using DealFortress.Modules.Users.Core.DTO;
using DealFortress.Modules.Users.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Users.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    public readonly UsersService _service;
    public UsersController(UsersService usersService)
    {
        _service = usersService;
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<UserResponse> GetUser(int id)
    {
    var response = _service.GetById(id);

    return response is null ? NotFound() : Ok(response);
    }
}