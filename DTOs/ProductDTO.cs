using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public record ProductDTO(int ProductId,
        string ProductName,
        double Price,
        string? Description,
        string? ImageUrl,
        string[] Colors,
        string Toptext,
        CategoryDTO Category);
}
//this.productService.getProducts().subscribe((response: PageResponse<ProductDTO>) => {
//    this.products = response.data;
//    this.totalCount = response.totalItems;
//});
