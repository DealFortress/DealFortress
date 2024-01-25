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
    public ActionResult<UserResponse> GetUser(string id, string idType)
    {
        UserResponse? response = null;

        if (int.TryParse(id,out int parsedId ) && idType.ToLower() == "id") 
        {
            response = _service.GetById(parsedId);
        } 
        else if (idType.ToLower() == "authid") 
        {
            response = _service.GetByAuthId(id);
        } 

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

    [NonAction]
    public virtual bool IsUserNoticeCreator(int id)
    {
        var currentUserAuthId = _service.GetCurrentUserAuthId();
        return _service.GetByAuthId(currentUserAuthId)?.Id == id;
    }

    [NonAction]
    public virtual string GetCurrentUserAuthId()
    {
        return _service.GetCurrentUserAuthId();
    }

    [NonAction]
    public virtual string? GetAuthIdByUserId(int userId)
    {
        return _service.GetAuthIdByUserId(userId);
    }

    [NonAction]
    public virtual int? GetUserIdByAuthId(string authId)
    {
        return _service.GetByAuthId(authId)?.Id;
    }
}