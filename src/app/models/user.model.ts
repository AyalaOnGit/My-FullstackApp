export interface UserDTO {
  UserId: number;
  UserEmail: string;
  UserFirstName: string;
  UserLastName: string;
  City?: string;
  Address?: string;
  Phon?: string;
  Role: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}