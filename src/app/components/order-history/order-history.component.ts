import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Footer1 } from '../footer1/footer';
import { Header } from '../header1/header';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [Footer1,Header,CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
  private orderService=inject(OrderService);
  userService=inject(UserService);

  ordersHistory:OrderDTO[]=[]

  ngOnInit(): void {
    const currentUser = this.userService.currentUser();
    
    if (!currentUser) return; // הגנה אם אין משתמש מחובר
  
    this.orderService.getOrders().subscribe({
      next: (allOrders) => {
        console.log('נתונים מהשרת:', allOrders);
        
        if (this.userService.isAdmin()) {
          this.ordersHistory = allOrders;
        } else {
          // שימי לב: ב-C# השדה הוא UserId (אות גדולה) ב-DTO
          this.ordersHistory = allOrders.filter(order => order.userId === currentUser.UserId);
        }
      },
      error: (err) => console.error('שגיאה בטעינת הזמנות:', err)
    });
  }

  updateOrderStatus(orderId: number) {
    if(!this.userService.isAdmin()){
    this.orderService.updateOrderStatus(orderId,'הגיע');}
    else{
      const statuses=this.orderService.getStatuses();
      const thisStatusIndex=statuses.findIndex(status=>status===this.ordersHistory.find(order=>order.orderId===orderId)?.status);
      if(thisStatusIndex<statuses.length-1){ //אם לא הגיע למצב האחרון
      this.orderService.updateOrderStatus(orderId,statuses[(thisStatusIndex+1)]);
      }
    }
  }
  
}
