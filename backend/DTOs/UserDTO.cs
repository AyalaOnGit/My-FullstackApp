
using System.ComponentModel.DataAnnotations;

namespace DTOs
{
    public record UserDTO(int UserId,

        //[property: Required(ErrorMessage = "אימייל הוא שדה חובה")]
        //[property: EmailAddress(ErrorMessage = "פורמט אימייל לא תקין")]
        string UserEmail,
        
        string UserFirstName,

        //[property: Required(ErrorMessage = "שם משפחה הוא שדה חובה")]
        //[property: StringLength(20, MinimumLength = 2, ErrorMessage = "שם משפחה חייב להיות בין 2 ל-20 תווים")]
        //
        string UserLastName,

        string? City,
        string? Address,

        //[property: Phone(ErrorMessage = "מספר טלפון לא תקין")]
        string? Phon,
        string Role= "user"
        );
}


