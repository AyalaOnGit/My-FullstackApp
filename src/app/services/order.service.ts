import { inject, Injectable } from '@angular/core';
import { OrderDTO } from '../models/order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Orders`;

  // רשימת הסטטוסים נשארת קבועה בצד הלקוח לסנכרון מול ה-UI
  statuses: string[] = ['באריזה', 'מוכן לשליחה', 'נשלח', 'בתחנת איסוף', 'הגיע'];

  constructor() { }

  /**
   * מחזיר את רשימת הסטטוסים האפשריים
   */
  getStatuses(): string[] {
    return this.statuses;
  }

  /**
   * שליפת כל ההזמנות מהשרת
   */
  getOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(this.apiUrl);
  }

  /**
   * שליפת הזמנה ספציפית לפי מזהה מהשרת
   */
  getOrderById(orderId: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * שליפת כל ההזמנות המכילות מוצר ספציפי
   * מבצע קריאה לשרת ומסנן את התוצאות
   */
  getOrdersByProductId(productId: number): Observable<OrderDTO[]> {
    return this.getOrders().pipe(
      map(orders => 
        orders.filter(order => 
          order.orderItems.some(item => item.productId === productId)
        )
      )
    );
  }

  /**
   * עדכון סטטוס הזמנה בשרת
   * שולח בקשת PUT ל-Endpoint המיועד
   */
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    // הבדיקה ב-Swagger מראה שהגוף הוא פשוט מחרוזת. 
    // השימוש ב-JSON.stringify(status) הוא מצוין כי הוא מוסיף את המירכאות הכפולות הנחוצות.
    return this.http.put(`${this.apiUrl}/${orderId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * הוספת הזמנה חדשה (לשימוש בסל הקניות בסיום הרכישה)
   */
  addOrder(order: OrderDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(this.apiUrl, order);
  }
}