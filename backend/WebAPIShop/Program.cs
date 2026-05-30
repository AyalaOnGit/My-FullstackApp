using Microsoft.EntityFrameworkCore;
using Repository;
using Servers;
using Entitys;
using NLog.Web;
using Services;
using WebAPIShop;
using WebAPIShop.Middleware;
using Microsoft.AspNetCore.Builder;
using PresidentsApp.Middlewares;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();


builder.Services.AddScoped<IProductRepository,ProductRepository>();
builder.Services.AddScoped<IPrudectsService, PrudectsService>();


builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrdersService, OrdersService>();


builder.Services.AddScoped<IPasswordService, PasswordService>();

builder.Services.AddDbContext<dbSHOPContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Ayal")));

builder.Host.UseNLog();

builder.Services.AddScoped<IRatingRepository, RatingRepository>();
builder.Services.AddScoped<IRatingService, RatingService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
// Add services to the container.

// הוספת שירות CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200") // הכתובת של אנגולר
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "My API V1");
    });
}
// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("AllowAngular");

app.UseErrorHandlingMiddleware();

app.UseRatingMiddleware();

app.UseAuthorization();

app.MapControllers();

// טעינת embeddings לכל המוצרים בעליית השרת
using (var scope = app.Services.CreateScope())
{
    try
    {
        var productService = scope.ServiceProvider.GetRequiredService<IPrudectsService>();
        var http = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>().CreateClient();
        var products = await productService.GetProducts(null, null, null, null, 200, null, 1);
        var productList = products.Data.Select(p => new {
            productId = p.ProductId,
            name = p.ProductName,
            price = p.Price,
            description = p.Description,
            category = p.Category?.CategoryName,
            imageUrl = p.ImageUrl,
            colors = p.Colors,
            toptext = p.Toptext
        }).ToList();
        await http.PostAsJsonAsync("http://localhost:8001/cache-products", new { products = productList });
    }
    catch { /* אם Python עדיין לא רץ בזמן עליית .NET — לא נכשל */ }
}

app.Run();
