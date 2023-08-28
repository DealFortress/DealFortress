using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace Bootstrapper.Auth;

public static class AuthenticationExtension
{
  public static void AddAuthenticationAndAuthorization(this WebApplicationBuilder builder)
  {

    var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
      options.Authority = domain;
      options.Audience = builder.Configuration["Auth0:Audience"];
      options.TokenValidationParameters = new TokenValidationParameters
      {
        NameClaimType = ClaimTypes.NameIdentifier
      };
    });


    builder.Services.AddAuthorization(options =>
    {
    options.AddPolicy("read:notices", policy => policy.Requirements.Add(new
        HasScopeRequirement("read:notices", domain)));
    });

    builder.Services.AddAuthorization(options =>
    {
    options.AddPolicy("create:notices", policy => policy.Requirements.Add(new
        HasScopeRequirement("create:notices", domain)));
    });

    builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
  }

}
