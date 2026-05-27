using System;
using System.Collections.Generic;

namespace Entitys;

public partial class User
{
    public int UserId { get; set; }

    public string UserEmail { get; set; } = null!;

    public string? UserFirstName { get; set; }

    public string? UserLastName { get; set; }

    public string UserPassword { get; set; } = null!;

    public string? City { get; set; }

    public string? Address { get; set; }

    public string? Phon { get; set; }
    public string Role { get; set; } = null!;


    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
