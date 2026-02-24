import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Cart } from '../../services/cart';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CartItem } from '../../models/product';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe,RouterLink,ButtonModule,CardModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardMin implements OnInit{
  loggedUser: any = null;
  
  // המשתנה שביקשת - האם המשתמש הוא אדמין
  @Input() isAdmin: boolean = false;

  checkUserRole() {
    // 1. שליפת המחרוזת מה-LocalStorage
    const userData = localStorage.getItem('loggedUser');

    if (userData) {
      try {
        // 2. המרה מפורמט טקסט (JSON) לאובייקט JavaScript
        this.loggedUser = JSON.parse(userData);

        // 3. בדיקה האם ה-role הוא 'admin'
        // שימוש ב-toLowerCase() עוזר למנוע בעיות אם בטעות נכתב Admin עם A גדולה
        this.isAdmin = this.loggedUser?.role?.toLowerCase() === 'admin';
        
        console.log('Is Admin:', this.isAdmin);
      } catch (error) {
        console.error('שגיאה בפענוח נתוני משתמש:', error);
        this.isAdmin = false;
      }
    } else {
      // אם אין משתמש מחובר בכלל
      this.isAdmin = false;
    }
  }

  ngOnInit() {
    this.checkUserRole();
  }

  @Input() product: CartItem | null = null; // שימוש במודל במקום כתיבת אובייקט ארוך

  @Output() edit = new EventEmitter<CartItem>(); // מאפשר לאבא לדעת שלחצו על עריכה
  
  onEdit() {
    if (this.product) {
      this.edit.emit(this.product); // שליחת המוצר לקומפוננטת האב לעריכה
    }
  }
  constructor(private cartService: Cart) {} // הזרקת השירות

  onAddToCart(event: Event) {
      event.stopPropagation()

    if (this.product) {
      // כאן אנחנו יוצרים את המוצר ה"סופי" שנכנס לסל
      const customProduct = {
        ...this.product,
        color: this.product.popularColor || 'לבן', // לוקח את הפופולרי או ברירת מחדל
        customText: this.product.topText || 'באהבה גדולה'
      };
      
      this.cartService.addToCart(customProduct);
      alert(`הוספת לסל: ${customProduct.name} עם הכיתוב "${customProduct.customText} עם הצבע "${customProduct.color}"`);
    }
  }
}
