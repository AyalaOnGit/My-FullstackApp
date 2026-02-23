import { computed, EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { UserDTO } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Users`;

  currentUser= signal<UserDTO | null> (this.getSavedUser());

  isAdmin= computed(() => this.currentUser()?.Role === 'admin');

  register(userData:UserDTO,password:string):Observable<UserDTO>{
    const url = `${this.apiUrl}?password=${encodeURIComponent(password)}`
    
    return this.http.post<UserDTO>(url,userData).pipe(
      tap(user=>
      {
        this.currentUser.set(user);
        localStorage.setItem('loggedUser',JSON.stringify(user))
      }
      )
    )
  }
  
  getCurrentUser(){
    return this.currentUser();
  }

  private users: UserDTO[] = [{    
    UserId: 1,
    UserEmail: 'a@a.a',
    UserFirstName: 'a',
    UserLastName: 'A',
    Role: 'user'},
    {UserId: 2,
    UserEmail: 'b@b.b',
    UserFirstName: 'b',
    UserLastName: 'B',
    Role: 'admin'},
    {    UserId: 3,
    UserEmail: 'c@c.c',
    UserFirstName: 'c',
    UserLastName: 'C',
    Role: 'user'}];


  constructor() { }

  //עוד מעט נעבוד על זה בעזרת השם יתברך
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
