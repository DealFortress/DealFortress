using DealFortress.Modules.Categories.Api;
using DealFortress.Modules.Notices.Api;
using Bootstrapper.Auth;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.AddAuthenticationAndAuthorization();

builder.Services.AddCategoriesModule(connectionString!);
builder.Services.AddNoticesModule(connectionString!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(policy =>
    {
    policy.AllowAnyOrigin()
        .AllowAnyMethod()   
        .AllowAnyHeader();
    });

}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();

app.UseStaticFiles();


app.Run();


