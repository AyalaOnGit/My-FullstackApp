using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public record  OrderItemDTO(int OrderItemId,
        int ProductId,
        string ProductName,
        int Quantity,
        string Popularcolore,
        string Customtext,
        double Price);
}

