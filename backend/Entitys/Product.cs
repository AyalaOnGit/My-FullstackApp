using System;
using System.Collections.Generic;

namespace Entitys;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public double Price { get; set; }

    public int CategoryId { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public string Colors { get; set; } = null!;

    public string Toptext { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;


    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
