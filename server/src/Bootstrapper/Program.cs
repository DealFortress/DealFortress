using DealFortress.Api.Modules.Categories.Extensions;
using DealFortress.Modules.Categories.Api;
// .Modules.Notices.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddCategories();
// builder.AddNotices();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthorization();

app.MapControllers();

app.Run();
