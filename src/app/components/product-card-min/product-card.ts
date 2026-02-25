import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // הוספנו CommonModule
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Cart } from '../../services/cart';
import { ProductDTO } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  standalone: true, // ודאי שזה standalone
  imports: [CommonModule, CurrencyPipe, ButtonModule, CardModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardMin {
  private router = inject(Router);
  private cartService = inject(Cart);

  @Input() isAdmin: boolean = false;
  @Input() productData!: ProductDTO;
  @Output() edit = new EventEmitter<ProductDTO>();

  goToDetails() {
    if (this.productData?.productId) {
      this.router.navigate(['/products', this.productData.productId]);
    }
  }

  onEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.goToDetails();
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
  
    if (this.productData) {
      // שליפת הערכים הפופולריים מתוך נתוני המוצר האמיתיים
      // אם אין צבעים במערך, נשתמש ב'לבן' כגיבוי (fallback)
      const popularColor = this.productData.colors && this.productData.colors.length > 0 
                           ? this.productData.colors[0] 
                           : 'לבן';
      
      // שליפת הטקסט הפופולרי מהשדה toptext
      const popularText = this.productData.toptext || 'באהבה גדולה';
  
      const customProduct = {
        productId: this.productData.productId,
        name: this.productData.productName,
        price: this.productData.price,
        imageUrl: this.productData.imageUrl,
        color: popularColor,
        customText: popularText
      };
  
      // הוספה לסל
      this.cartService.addToCart(customProduct as any);
  
      // הודעה קופצת מעוצבת עם הערכים שנבחרו דינמית
      Swal.fire({
        title: 'הוספה מהירה לסל',
        html: `
          <div style="text-align: right; direction: rtl; font-family: sans-serif;">
            <p>הוספנו עבורך את האפשרויות הפופולריות ביותר למוצר זה:</p>
            <div style="margin-top: 15px;">
              <span style="background: #e0f7fa; color:rgb(59, 149, 152); padding: 8px 12px; border-radius: 20px; font-size: 0.9em; display: inline-block; margin-bottom: 10px;">
                 🎨 צבע מבוקש: <b>${popularColor}</b>
              </span>
              <br>
              <span style="background:rgba(166, 210, 214, 0.73); color:rgb(82, 162, 165); padding: 8px 12px; border-radius: 20px; font-size: 0.9em; display: inline-block;">
                 ✍️ הקדשה נפוצה: <b>"${popularText}"</b>
              </span>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'מעולה!',
        confirmButtonColor: '#46c1e1',
        timer: 4500,
        timerProgressBar: true
      });
    }
  }
}