using System.Reflection;
using DealFortress.Modules.Categories.Api;
using DealFortress.Shared.Abstractions;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ----------------
var env = builder.Environment;

// builder.AddCustomSerilog(env);
// builder.Services.AddJwt();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCustomSwagger(configuration,
    typeof(CategoriesRoot).Assembly,

// builder.Services.AddCustomCap();
// builder.Services.AddTransient<IBusPublisher, BusPublisher>();
// builder.Services.AddCustomVersioning();

// builder.Services.AddCustomProblemDetails();

builder.Services.AddCategoriesModule(configuration);
// builder.Services.AddPassengerModules(configuration);
// builder.Services.AddBookingModules(configuration);
// builder.Services.AddIdentityModules(configuration, env);

// builder.Services.AddEasyCaching(options => { options.UseInMemory(configuration, "mem"); });

// builder.Services.AddCustomMediatR(
//     typeof(FlightRoot).Assembly,
//     typeof(IdentityRoot).Assembly,
//     typeof(PassengerModule).Assembly,
//     typeof(BookingRoot).Assembly
// );







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

// app.UseSerilogRequestLogging();
// app.UseCorrelationId();
// app.UseRouting();
// app.UseAuthentication();
// app.UseAuthorization();
// app.UseHttpsRedirection();

// app.UseFlightModules();
// app.UsePassengerModules();
// app.UseBookingModules();
// app.UseIdentityModules();

// app.UseProblemDetails();

// app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

// app.MapGet("/", x => x.Response.WriteAsync(appOptions.Name));

// --------------------------------

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
