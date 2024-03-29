using DealFortress.Modules.Categories.Api;
using DealFortress.Modules.Notices.Api;
using DealFortress.Modules.Users.Api;
using DealFortress.Modules.Conversations.Api;
using Bootstrapper.Auth;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using DealFortress.Modules.Notices.Core.Domain.Data;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using System.Net.NetworkInformation;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.AddAuthenticationAndAuthorization();

builder.Services
    .AddUsersModule(connectionString!)
    .AddConversationsModule(connectionString!)
    .AddCategoriesModule(connectionString!)
    .AddNoticesModule(connectionString!)
    .AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "My Api", Version = "v1" });
    opt.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Scheme = "bearer"
    });
    opt.OperationFilter<SecureEndpointAuthRequirementFilter>();
});

builder.Services.AddDataProtection().UseCryptographicAlgorithms(
    new AuthenticatedEncryptorConfiguration
    {
        EncryptionAlgorithm = EncryptionAlgorithm.AES_256_CBC,
        ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
    });



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(policy =>
    {
    policy
        .WithOrigins("https://localhost:4000","http://localhost:4000","http://127.0.0.1:4000","http://localhost")
        .AllowAnyMethod() 
        .AllowCredentials()  
        .AllowAnyHeader();
    });

    app.Services.SeedNotices();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.MapConversationsHub();

app.Run();

