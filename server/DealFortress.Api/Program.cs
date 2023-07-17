using DealFortress.Api.Modules.Categories;
using DealFortress.Api.Services;
using DealFortress.Api.UnitOfWork;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DealFortressContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<ProductsService>();
builder.Services.AddSingleton<NoticesService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var context = app.Services.GetService<DealFortressContext>();
var unitOfWork = app.Services.GetService<IUnitOfWork>();
var categoriesModule = new CategoriesModule(context!, unitOfWork!);

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

    using (var scope = app.Services.CreateScope())
    {
    var services = scope.ServiceProvider;
    // SeedData.Initialize(services);
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
