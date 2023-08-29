using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
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
        NameClaimType = ClaimTypes.NameIdentifier,
        ValidateAudience = true,
        ValidateLifetime = true
      };
    });

      builder.Services.AddAuthorization(options =>
      {
        options.AddPolicy("CreateNotices", policy => 
                          policy.RequireClaim("permissions", "create:notices"));
      });
  }
}
