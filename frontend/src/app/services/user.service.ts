import { computed, inject, Injectable, signal } from '@angular/core';
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

  // טעינה ראשונית מה-LocalStorage
  currentUser = signal<UserDTO | null>(null);

  // מחושב - תמיד יתעדכן כש-currentUser משתנה
  isAdmin = computed(() => {
    const u = this.currentUser();
    return u?.role === 'admin' || (u as any)?.Role === 'admin';
  });

  constructor() {
    localStorage.removeItem('loggedUser');
  }

  /**
   * הרשמה
   */
  register(userData: UserDTO, password: string): Observable<UserDTO> {
    const url = `${this.apiUrl}?password=${encodeURIComponent(password)}`;
    return this.http.post<UserDTO>(url, userData).pipe(
      tap(user => this.saveToLocal(user))
    );
  }
  // בתוך user.service.ts
  checkPasswordStrength(password: string): Observable<{ thePassword: string, level: number }> {
    return this.http.post<{ thePassword: string, level: number }>(
      `${environment.apiUrl}/Password`, // ודאי שה-URL הזה נכון
      { thePassword: password }
    );
  }
  /**
   * התחברות
   */
  login(email: string, password: string): Observable<UserDTO | null> {
    const loginData = { userEmail: email, userPassword: password };

    return this.http.post<UserDTO>(`${this.apiUrl}/login`, loginData).pipe(
      tap(user => {
        if (user) this.saveToLocal(user);
      })
    );
  }

  /**
   * עדכון פרטים - שינוי קטן כאן: שומרים את ה-Response מהשרת
   */
  updateUser(id: number, userData: UserDTO, password: string): Observable<UserDTO> {
    const url = `${this.apiUrl}/${id}?password=${encodeURIComponent(password)}`;
    // שיניתי מ-any ל-Observable<UserDTO> כדי לקבל את המשתמש המעודכן חזרה
    return this.http.put<UserDTO>(url, userData).pipe(
      tap(updatedUserFromServer => {
        // שומרים את מה שחזר מהשרת - זה הכי בטוח
        const dataToSave = updatedUserFromServer || userData;
        this.saveToLocal(dataToSave);
      })
    );
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('loggedUser');
  }

  // --- עזר ---

  private saveToLocal(user: UserDTO) {
    this.currentUser.set(user);
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  private getSavedUser(): UserDTO | null {
    const saved = localStorage.getItem('loggedUser');
    if (!saved) return null;
    try {
      return JSON.parse(saved) as UserDTO;
    } catch (e) {
      console.error('Error parsing user from storage', e);
      return null;
    }
  }
}