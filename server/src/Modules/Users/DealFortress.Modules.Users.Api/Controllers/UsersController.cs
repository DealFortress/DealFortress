using DealFortress.Modules.Users.Core.Domain.Services;
using DealFortress.Modules.Users.Core.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DealFortress.Modules.Users.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    public readonly IUsersService _service;
    public UsersController(IUsersService usersService)
    {
        _service = usersService;
    }

    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<UserResponse> GetUser(string id, string idType)
    {
       var response = idType switch
    {
       "authid" => _service.GetByAuthId(id),
       "id" => _service.GetById(int.Parse(id)),
       _ => _service.GetById(int.Parse(id))
    };

    return response is null ? NotFound() : Ok(response);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<UserResponse> PostUser(UserRequest request)
    {
        var response = _service.Post(request);

        return CreatedAtAction("GetUser", new { id = response.Id }, response);
    }


}