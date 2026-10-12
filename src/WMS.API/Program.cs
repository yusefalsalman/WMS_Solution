using Microsoft.EntityFrameworkCore;
using WMS.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(c =>
    {
        c.DocumentTitle = "WMS API";
        c.SwaggerEndpoint("/openapi/v1.json", "WMS API V1");
    });
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

