import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Footer1 } from '../footer1/footer';
import { Header } from '../header1/header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [Footer1, Header, CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef); // הזרקת שירות זיהוי שינויים
  userService = inject(UserService);

  ordersHistory: OrderDTO[] = [];

  ngOnInit(): void {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return;

    const orders$ = this.userService.isAdmin()
      ? this.orderService.getOrders()
      : this.orderService.getOrdersByUserId(currentUser.userId ?? currentUser.UserId!);

    orders$.subscribe({
      next: (orders: any[]) => {
        this.ordersHistory = orders;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('שגיאה בטעינת הזמנות:', err)
    });
  }

  updateOrderStatus(orderId: number) {
    const statuses = this.orderService.getStatuses();
    let nextStatus: string = '';
  
    // מוצאים את המיקום של ההזמנה במערך
    const orderIndex = this.ordersHistory.findIndex(o => ((o as any).OrderId || o.orderId) === orderId);
    if (orderIndex === -1) return;
  
    const order = this.ordersHistory[orderIndex];
  
    // לוגיקה לקביעת הסטטוס הבא
    if (!this.userService.isAdmin()) {
      nextStatus = 'הגיע';
    } else {
      const currentStatus = (order as any).Status || (order as any).status;
      const currentIndex = statuses.indexOf(currentStatus);
      if (currentIndex !== -1 && currentIndex < statuses.length - 1) {
        nextStatus = statuses[currentIndex + 1];
      } else return;
    }
  
    // שליחה לשרת
    this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: () => {
        // 1. יצירת עותק חדש של האובייקט (Shallow Copy)
        const updatedOrder = { ...this.ordersHistory[orderIndex] };
        
        // 2. עדכון הסטטוס באובייקט החדש (תמיכה ב-PascalCase ו-camelCase)
        if ((updatedOrder as any).Status !== undefined) {
          (updatedOrder as any).Status = nextStatus;
        } else {
          (updatedOrder as any).status = nextStatus;
        }
  
        // 3. עדכון המערך בצורה אימוטבילית (החלפת המערך כולו)
        const newHistory = [...this.ordersHistory];
        newHistory[orderIndex] = updatedOrder as OrderDTO;
        this.ordersHistory = newHistory;
        
        // 4. הפקודה שגורמת לשינוי להופיע מיד על המסך
        this.cdr.detectChanges();
        
        console.log(`הסטטוס של הזמנה ${orderId} עודכן ל-${nextStatus}`);
      },
      error: (err) => console.error('שגיאה בעדכון סטטוס:', err)
    });
  }
}