namespace DTOs
{
    public record ResultValidUser<T>(bool InvalidPassword, bool UserAlreadyExists, bool IsValidEmail, T data);
}
