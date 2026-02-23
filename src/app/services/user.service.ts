import { computed, inject, Injectable, signal } from '@angular/core';
import { UserDTO } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44324/api/Users';
  currentUser= signal<UserDTO | null> (this.getSavedUser());


  isAdmin= computed(() => this.currentUser()?.role === 'admin');
  
  getCurrentUser(){
    return this.currentUser();
  }

  private users: UserDTO[] = [{    
    UserId: 1,
    UserEmail: 'a@a.a',
    UserFirstName: 'a',
    UserLastName: 'A',
    role: 'user'},
    {UserId: 2,
    UserEmail: 'b@b.b',
    UserFirstName: 'b',
    UserLastName: 'B',
    role: 'admin'},
    {    UserId: 3,
    UserEmail: 'c@c.c',
    UserFirstName: 'c',
    UserLastName: 'C',
    role: 'user'}];


  constructor() { }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.UserEmail === email);
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem('loggedUser', JSON.stringify(user)); // שמירה בזיכרון הדפדפן
      return true; // כניסה מוצלחת
    }
    return false; // כניסה נכשלה}
}

logout() {
    this.currentUser.set(null);
    localStorage.removeItem('loggedUser'); // הסרת המשתמש מהזיכרון הדפדפן
  }

  private getSavedUser(): UserDTO | null {
    const saved = localStorage.getItem('loggedUser');
    return saved ? JSON.parse(saved) : null;
  }
}
