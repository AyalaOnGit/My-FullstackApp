import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category'; // ייבוא המודל

import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // הנתונים הסטטיים שלך עוברים לכאן
  // private categories: Category[] = [
  //   { label: 'כל הקטגוריות', value: 'all' },
  //   { label: 'שתייה חמה', value: 'שתייה חמה' },
  //   { label: 'מאפים', value: 'מאפים' }
  // ];

  private http = inject(HttpClient);
  private categoriesApiUrl=`${environment.apiUrl}/Categories`;

  constructor() {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesApiUrl);
  }
}
