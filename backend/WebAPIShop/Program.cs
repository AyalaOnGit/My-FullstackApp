using Microsoft.EntityFrameworkCore;
using Repository;
using Servers;
using Entitys;
using NLog.Web;
using Services;
using WebAPIShop;
using WebAPIShop.Middleware;
using WebAPIShop.Extensions;
using Microsoft.AspNetCore.Builder;
using PresidentsApp.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IPrudectsService, PrudectsService>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrdersService, OrdersService>();

builder.Services.AddScoped<IPasswordService, PasswordService>();

builder.Services.AddDbContext<dbSHOPContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Ayal")));

builder.Host.UseNLog();

builder.Services.AddScoped<IRatingRepository, RatingRepository>();
builder.Services.AddScoped<IRatingService, RatingService>();
builder.Services.AddSingleton<IKafkaProducerService, KafkaProducerService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddCustomRateLimiter();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        In = ParameterLocation.Header,
        Description = "הכנס את ה-JWT token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "GiftForU API V1");
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("AllowAngular");

app.UseRouting();

// מחלץ את ה-token מה-cookie ומוסיף כ-Bearer
app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["jwt"];
    if (!string.IsNullOrEmpty(token))
        context.Request.Headers["Authorization"] = $"Bearer {token}";
    await next();
});

app.UseAuthentication();

app.UseRateLimiter();

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
