namespace DTOs
{
    public record UserDTO(
        int UserId,
        string UserEmail,
        string UserFirstName,
        string UserLastName,
        string? City,
        string? Address,
        string? Phon,
        string Role = "user"
    );
}
