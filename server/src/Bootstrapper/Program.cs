// using System.Reflection;
using DealFortress.Modules.Categories.Api;
using DealFortress.Shared.Abstractions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ----------------

var category = new CategoriesModule();
category.AddCategoriesModule(builder.Services, configuration);


// module is static
// builder.Services.AddCategoriesModule(configuration);

// -----------------

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

// -----------------------------------

// --------------------------------

app.UseHttpsRedirection();

app.UseAuthorization();


// app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
app.MapControllers();

app.Run();
