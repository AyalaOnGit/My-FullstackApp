export interface UserDTO {
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  city?: string;
  address?: string;
  phon?: string;
  role: string;

  // תמיכה בPascalCase למקרה שחלק מהקוד משתמש בו
  UserId?: number;
  UserEmail?: string;
  UserFirstName?: string;
  UserLastName?: string;
  Role?: string;
}
