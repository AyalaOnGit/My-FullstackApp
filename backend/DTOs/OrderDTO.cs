using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public record OrderDTO(int OrderId,
        DateOnly OrderDate,
        ICollection<OrderItemDTO> OrderItems,
        int UserId,
        string Status="באריזה",
        double OrderSum=0)
;
}


