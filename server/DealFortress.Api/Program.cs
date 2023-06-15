using DealFortress.Api.Data;
using DealFortress.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DealFortressContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<NoticeService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
    }
}

app.UseCors(policy =>
{
  policy.AllowAnyOrigin()
  .AllowAnyMethod()
  .AllowAnyHeader();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
