import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PageResponse, ProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  

  // ניהול הסטייט
  private productsSignal = signal<ProductDTO[]>([]);
  private totalCountSignal = signal<number>(0);

  readonly products = this.productsSignal.asReadonly();
  readonly totalCount = this.totalCountSignal.asReadonly();

  constructor(private http: HttpClient) {}

  // 1. פונקציית הבסיס שמחזירה Observable - שימושית לסינונים וטעינות
  getProducts(
    description?: string,
    minPrice?: number,
    maxPrice?: number,
    categoriesId?: number[], // שם הפרמטר כמו ב-C#
    limit: number = 25,
    offset: number = 1       // שם הפרמטר כמו ב-C#
  ): Observable<PageResponse<ProductDTO>> {
    
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    if (description) params = params.set('description', description);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    
    if (categoriesId && categoriesId.length > 0) {
      categoriesId.forEach(id => params = params.append('categoriesId', id.toString()));
    }
  
    // הקריאה מחזירה את האובייקט המלא מה-Controller
    return this.http.get<PageResponse<ProductDTO>>(this.apiUrl, { params });
  }
  
  // עדכון פונקציית הטעינה שתומכת ב-Signals
  loadProducts(description?: string, minPrice?: number, maxPrice?: number, categoriesId?: number[], limit: number = 8, offset: number = 1): void {
    this.getProducts(description, minPrice, maxPrice, categoriesId, limit, offset)
      .subscribe(response => {
        this.productsSignal.set(response.items);      // מעדכן את רשימת המוצרים
        this.totalCountSignal.set(response.totalCount); // מעדכן את הכמות הכוללת לפגינציה
      });
  }

  // 3. הוספת מוצר
  addProduct(newProduct: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.apiUrl, newProduct).pipe(
      tap(product => {
        this.productsSignal.update(all => [...all, product]);
        this.totalCountSignal.update(count => count + 1);
      })
    );
  }

  // 4. עדכון מוצר
  updateProduct(id: number, updatedProduct: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}`, updatedProduct).pipe(
      tap(product => {
        this.productsSignal.update(all => all.map(p => p.productId === id ? product : p));
      })
    );
  }

// 5. מחיקת מוצר - גרסה מאוחדת ותקינה
deleteProduct(productId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
    tap(() => {
      // עדכון ה-Signals המקומיים רק לאחר שהמחיקה בשרת הצליחה
      this.productsSignal.update(all => all.filter(p => p.productId !== productId));
      this.totalCountSignal.update(count => count - 1);
    })
  );
}

// שליפת מוצר לפי ID
getProductById(id: number): Observable<ProductDTO> {
  return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`);
}
}