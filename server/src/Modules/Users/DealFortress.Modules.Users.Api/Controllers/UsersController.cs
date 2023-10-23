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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<UserResponse> GetUser(int id)
    {
    var response = _service.GetById(id);

    return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("authid/{authId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<UserResponse> GetUserByAuthId(string authId)
    {
    var response = _service.GetByAuthId(authId);

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