import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [Footer1, Header, FormsModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  isAdmin = this.userService.isAdmin;
  currentProduct!: ProductDTO;
  productId: number = 0;

  // משתני עזר לתצוגה ועריכה
  productName: string = '';
  productPrice: number = 0;
  productImage: string = 'assets/images/default-product.png';
  productDescription: string = '';
  colors: string[] = [];
  selectedColor: string = '';
  userText: string = '';
  showToast: boolean = false;
  isEditing: boolean = false;
  originalProductSnapshot!: string;

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.productId = idFromRoute ? Number(idFromRoute) : 0;

    if (this.productId === 0) {
      this.isEditing = true;
      this.productImage = 'assets/placeholder.jpg';
    } else {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.productName = product.productName;
        this.productPrice = product.price;
        this.productImage = product.imageUrl ?? 'assets/images/default-product.png';
        this.productDescription = product.description ?? 'אין תיאור זמין למוצר זה';
        this.colors = [...product.colors];
      },
      error: (err) => console.error('שגיאה בטעינת המוצר:', err)
    });
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  addToCart() {
    if (!this.userText || this.userText.trim() === '') {
      Swal.fire({
        title: 'אופססס',
        text: "...נראה ששכחת להוסיף טקסט",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#46c1e1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'להמשיך בכל אופן',
        cancelButtonText: 'ביטול'
      }).then((result) => {
        if (result.isConfirmed) this.addToCartLogic();
      });
    } else {
      this.addToCartLogic();
    }
  }

  addToCartLogic() {
    alert(`המוצר ${this.productName} נוסף לסל!`);
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    });
  }

  // --- לוגיקת ניהול (Admin) ---

  editProduct() {
    this.isEditing = true;
    this.originalProductSnapshot = JSON.stringify({
      name: this.productName,
      price: this.productPrice,
      desc: this.productDescription,
      img: this.productImage,
      colors: this.colors
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadProduct();
  }

  saveProduct() {
    if (!this.productName.trim() || !this.productDescription.trim()) {
      Swal.fire('שם המוצר והתיאור אינם יכולים להיות ריקים', '!שגיאה', 'error');
      return;
    }
    if (this.productPrice <= 0) {
      Swal.fire('המחיר חייב להיות גבוה מ-0', '!שגיאה', 'error');
      return;
    }

    const updatedData: ProductDTO = {
      ...this.currentProduct,
      productName: this.productName,
      price: this.productPrice,
      description: this.productDescription,
      imageUrl: this.productImage,
      colors: [...this.colors]
    };

    this.productService.updateProduct(this.productId, updatedData).subscribe({
      next: (response) => {
        this.currentProduct = response;
        this.isEditing = false;
        Swal.fire('!נשמר', 'פרטי המוצר עודכנו בהצלחה', 'success');
      },
      error: () => Swal.fire('אופס...', 'העדכון נכשל', 'error')
    });
  }

  deleteProduct() {
    Swal.fire({
      title: '?האם את/ה בטוחה',
      text: "!לא תוכל/י לבטל פעולה זו",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#46c1e1',
      cancelButtonColor: '#d33',
      confirmButtonText: '!כן, בצע',
      cancelButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        const statuses = this.orderService.getStatuses();
        const shippedIndex = statuses.indexOf('נשלח');

        // תיקון קריטי: הרשמה ל-Observable כדי לקבל את ההזמנות מהשרת
        this.orderService.getOrdersByProductId(this.productId).subscribe(ordersWithProduct => {
          const hasPendingOrders = ordersWithProduct.find(order => statuses.indexOf(order.status) < shippedIndex);

          if (hasPendingOrders) {
            Swal.fire('!שים לב', '...יש לך הזמנות שטרם נשלחו עבור מוצר זה', 'warning');
          } else {
            // קריאה לשרת למחיקה (בהנחה שקיימת פונקציה כזו ב-Service שמחזירה Observable)
            this.productService.deleteProduct(this.productId).subscribe(() => {
              Swal.fire('הצלחנו!', 'המוצר נמחק', 'success');
              this.router.navigate(['/home']);
            });
          }
        });
      }
    });
  }

  // --- ניהול צבעים ותמונה ---
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.productImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  addColor(newColor: string) {
    const cleaned = newColor?.trim();
    if (cleaned && !this.colors.includes(cleaned) && this.isValidColor(cleaned)) {
      this.colors.push(cleaned);
    }
  }

  isValidColor(strColor: string): boolean {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  }

  removeColor(index: number) {
    this.colors.splice(index, 1);
  }
}