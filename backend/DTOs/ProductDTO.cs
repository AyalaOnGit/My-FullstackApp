namespace DTOs
{
    public record ProductDTO(
        int ProductId,
        string ProductName,
        double Price,
        string? Description,
        string? ImageUrl,
        string[] Colors,
        string Toptext,
        CategoryDTO Category);
}
