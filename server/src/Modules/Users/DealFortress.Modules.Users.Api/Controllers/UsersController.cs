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
    public async Task<ActionResult<UserResponse>> GetUserAsync(string id, string idType)
    {
        UserResponse? response = null;

        if (int.TryParse(id,out int parsedId ) && idType.ToLower() == "id") 
        {
            response = await _service.GetByIdAsync(parsedId);
        } 
        else if (idType.ToLower() == "authid") 
        {
            response = await _service.GetByAuthIdAsync(id);
        } 

        return response is null ? NotFound() : Ok(response);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserResponse>> PostUserAsync(UserRequest request)
    {
        var response = await _service.PostAsync(request);

        return CreatedAtAction("GetUser", new { id = response.Id }, response);
    }

    [NonAction]
    public virtual async Task<bool> IsUserNoticeCreator(int id)
    {
        var currentUserAuthId = _service.GetCurrentUserAuthId();
        var entity = await _service.GetByAuthIdAsync(currentUserAuthId);
        return entity?.Id == id;
    }

    [NonAction]
    public virtual string GetCurrentUserAuthId()
    {
        return _service.GetCurrentUserAuthId();
    }

    [NonAction]
    public virtual async Task<string?> GetAuthIdByUserId(int userId)
    {
        return await _service.GetAuthIdByUserIdAsync(userId);
    }

    [NonAction]
    public virtual async Task<int?> GetUserIdByAuthId(string authId)
    {
        var entity = await _service.GetByAuthIdAsync(authId);
        return entity?.Id;
    }
}