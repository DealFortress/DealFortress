using DealFortress.Modules.Categories.Api;
using DealFortress.Modules.Notices.Api;


var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCategoriesModule(configuration);
builder.Services.AddNoticesModule(configuration);

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

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();


