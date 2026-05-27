using AutoMapper;
using DTOs;
using Entitys;

namespace WebAPIShop
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, LoginUserDTO>().ReverseMap();
            CreateMap<Order, OrderDTO>().ReverseMap();

            CreateMap<OrderItem, OrderItemDTO>()
                .ForCtorParam("ProductName", opt => opt.MapFrom(src => src.Product.ProductName))
                // פה הקסם: אנחנו ניגשים ל-Product שבתוך ה-OrderItem ולוקחים ממנו את ה-Price
                .ForCtorParam("Price", opt => opt.MapFrom(src => src.Product.Price))
                .ForCtorParam("Popularcolore", opt => opt.MapFrom(src => src.Popularcolore))
                .ForCtorParam("Customtext", opt => opt.MapFrom(src => src.Customtext))
                .ReverseMap();
            // מיפוי קטגוריה: מה-Entity ל-Record
            // מכיוון שב-DTO יש רק CategoryName, אנחנו שולפים אותו מה-Entity
            CreateMap<Category, CategoryDTO>()
                .ConstructUsing(src => new CategoryDTO(src.CategoryName))
                .ReverseMap();

            // מיפוי מ-Entity ל-DTO (עבור ה-GET)
            CreateMap<Product, ProductDTO>()
                .ForCtorParam("Colors", opt => opt.MapFrom(src =>
                    (string.IsNullOrWhiteSpace(src.Colors) || src.Colors == "[]")
                        ? new string[0]
                        : src.Colors.Split(',', StringSplitOptions.RemoveEmptyEntries)))
                .ForCtorParam("Category", opt => opt.MapFrom(src =>
                    src.Category != null ? new CategoryDTO(src.Category.CategoryName) : null));

            // מיפוי מ-DTO ל-Entity (עבור ה-POST/PUT)
            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.Colors, opt => opt.MapFrom(src =>
                    (src.Colors != null && src.Colors.Length > 0) ? string.Join(",", src.Colors) : ""))
                // חשוב: אם ה-DTO שלך מכיל CategoryDTO, ודאי שיש לך דרך להוציא CategoryId 
                // אם ה-DTO לא מכיל ID של קטגוריה, ה-Entity יצטרך טיפול ידני ב-Service
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore());
            //// מיפוי מ-Entity ל-DTO (עבור ה-GET)
            //CreateMap<Product, ProductDTO>()
            //    .ForCtorParam("Colors", opt => opt.MapFrom(src =>
            //        // בדיקה אם המחרוזת ריקה, NULL, או מכילה את הטקסט "[]" מה-DB
            //        (string.IsNullOrWhiteSpace(src.Colors) || src.Colors == "[]")
            //            ? new string[0]
            //            : src.Colors.Split(',', StringSplitOptions.RemoveEmptyEntries)))
            //    .ForCtorParam("Category", opt => opt.MapFrom(src =>
            //        src.Category != null ? new CategoryDTO(src.Category.CategoryName) : null));

            //// מיפוי מ-DTO ל-Entity (עבור ה-POST/PUT)
            //CreateMap<ProductDTO, Product>()
            //    .ForMember(dest => dest.Colors, opt => opt.MapFrom(src =>
            //        (src.Colors != null && src.Colors.Length > 0) ? string.Join(",", src.Colors) : "[]"))
            //    .ForMember(dest => dest.Category, opt => opt.Ignore())
            //    .ForMember(dest => dest.OrderItems, opt => opt.Ignore());
        }
    }
}
