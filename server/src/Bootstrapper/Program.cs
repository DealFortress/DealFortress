using DealFortress.Modules.Categories.Api;
using DealFortress.Modules.Notices.Api;
using DealFortress.Modules.Users.Api;
using DealFortress.Modules.Messages.Api;
using Bootstrapper.Auth;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.AddAuthenticationAndAuthorization();

builder.Services.AddCategoriesModule(connectionString!);
builder.Services.AddNoticesModule(connectionString!);
builder.Services.AddUsersModule(connectionString!);
builder.Services.AddMessagesModule(connectionString!);
builder.Services.AddControllers();

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
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.MapMessageHub();

app.Run();


