import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { OrderService } from '../../services/order.service'; // ה-Service המעולה שלך
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderDTO } from '../../models/order.model';
import { FormsModule } from '@angular/forms'; // עבור ה-ngModel בטופס
import { CardModule } from 'primeng/card'; // פותר את השגיאה של p-card
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    DividerModule,
    CommonModule,
    FormsModule,
    CardModule,       // <--- זה מה שחסר לך
    InputTextModule,  // עבור ה-Input הרגיל
    InputMaskModule,  // עבור מסכת האשראי
    ButtonModule,     // עבור הכפתור
    RippleModule      // עבור האפקט בכפתור
  ],
  // ודאי שכל המודולים של PrimeNG נמצאים כאן ב-imports (ButtonModule, InputTextModule, וכו')
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(Cart);
  private orderService = inject(OrderService);
  private router = inject(Router);

  // הנתונים שה-HTML מציג בסיכום ההזמנה
  cartItems = this.cartService.getItems();
  // זה המשתנה שה-HTML שלך מחפש:
  totalPrice = this.cartService.getTotalSum();
  // האובייקט שקשור לטופס האשראי ב-HTML
  isLoading = false;
  paymentDetails = {
    fullName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  ngOnInit() {
    if (this.cartItems.length === 0) {
      this.router.navigate(['/store']);
    }
  }
  processOrder() {
    const userJson = localStorage.getItem('loggedUser');
    if (!userJson) {
      Swal.fire({
        title: 'אופס',
        text: 'חובה להתחבר כדי לבצע הזמנה',
        icon: 'error',
        confirmButtonColor: '#46d9e1'
      });
      return;
    }
    const user = JSON.parse(userJson);
  
    // יצירת האובייקט בפורמט שה-Backend (C#) דורש
    const newOrder = {
      OrderId: 0,
      OrderDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD עבור DateOnly
      UserId: user.userId ?? user.UserId,
      OrderSum: this.totalPrice,
      Status: "באריזה",
      OrderItems: this.cartItems.map(item => ({
        OrderItemId: 0,
        ProductId: item.productId,
        ProductName: item.name || "Product",
        Quantity: item.quantity,
        Popularcolore: item.color || "default",
        Customtext: item.customText || "",
        Price: item.price,             // שלחי את המחיר מהסל
      }))
    };
  
    // הוספת "as any" כדי לפתור את שגיאת ה-ts(2345)
    this.isLoading = true;
    this.orderService.addOrder(newOrder as any).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'הזמנתך התקבלה!',
          text: 'תודה שקנית אצלנו',
          icon: 'success',
          iconColor: '#46d9e1',
          confirmButtonColor: '#46d9e1',
          confirmButtonText: 'מעולה'
        }).then(() => {
          this.cartService.clearCart();
          this.router.navigate(['/home']);
        });
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'אירעה שגיאה טכנית',
          text: 'ייתכן שההזמנה בוצעה — בדקי את היסטוריית ההזמנות לפני שתנסי שוב.',
          icon: 'warning',
          confirmButtonColor: '#46d9e1'
        });
      }
    });
  }
}