import { Component, inject, OnInit ,ChangeDetectorRef} from '@angular/core';
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
import { Cart } from '../../services/cart';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';
import { environment } from '../../../environments/environment';

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
  private cdr = inject(ChangeDetectorRef); // הזרקת ה-Change Detector
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private cartService = inject(Cart);
  private categoryService = inject(CategoryService); // הזרקה
  
  categories: Category[] = []; // רשימת כל הקטגוריות מהשרת
  selectedCategoryName: string = ''; // הקטגוריה שנבחרה ב-Select

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
    this.loadCategories();
  
    // במקום snapshot, אנחנו עושים subscribe לשינויים בפרמטרים
    this.route.paramMap.subscribe(params => {
      const idFromRoute = params.get('id');
      this.productId = idFromRoute ? Number(idFromRoute) : 0;
  
      if (this.productId === 0) {
        this.prepareForNewProduct();
      } else {
        this.isEditing = false; // מוודא שאנחנו לא במצב עריכה כשעוברים למוצר קיים
        this.loadProduct();
      }
    });
  }
  // פונקציית עזר לאיפוס השדות למוצר חדש
  private prepareForNewProduct() {
    this.isEditing = true;
    this.currentProduct = {} as ProductDTO; // אובייקט ריק
    this.productName = '';
    this.productPrice = 0;
    this.productDescription = '';
    this.productImage = 'assets/images/upload-placeholder.png'; // או נתיב לתמונה ריקה
    this.colors = [];
    this.selectedCategoryName = '';
    this.cdr.detectChanges();
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe(list => {
      console.log('Categories loaded:', list); // תבדקי מה מודפס כאן בקונסול
      this.categories = list;
      this.cdr.detectChanges(); // מבטיח שה-HTML יתעדכן כשהנתונים מגיעים
    });
  }
// product-card.component.ts

loadProduct() {
  this.productService.getProductById(this.productId).subscribe({
    next: (product) => {
      console.log('המוצר שהגיע מהשרת:', product);
      this.currentProduct = product;
      this.productName = product.productName;
      this.productPrice = product.price;

      if (product.imageUrl) {
        // מחברים את שם התיקייה עם שם הקובץ מה-DB
        this.productImage = 'productsImages/' + product.imageUrl;
      } else {
        this.productImage = 'assets/images/default-product.png';
      }
      
      // this.productImage = product.imageUrl ?? 'assets/images/default-product.png';
      this.productDescription = product.description ?? 'אין תיאור זמין';
      this.colors = product.colors ? [...product.colors] : [];
      
      // כאן תיקנתי מ-value ל-categoryName (בהתאם ל-DTO בשרת)
      const categoryObj = product.category as any;
      
      if (categoryObj) {
        // עכשיו הוא ייתן לך להשתמש ב-categoryName בלי לצעוק
        this.selectedCategoryName = categoryObj.categoryName || '';
      }
      
      this.cdr.detectChanges(); 
    }
  });
}

  selectColor(color: string) {
    this.selectedColor = color;
  }
  addToCart() {
    // 1. בדיקה שנבחר צבע (ליתר ביטחון, למרות שהכפתור חסום)
    if (!this.selectedColor) {
      Swal.fire('אופס', 'חובה לבחור צבע לפני ההוספה לסל', 'info');
      return;
    }

    // 2. בדיקת טקסט אישי
    if (!this.userText || this.userText.trim() === '') {
      Swal.fire({
        title: 'נראה ששכחת להוסיף טקסט',
        text: "האם להמשיך להוספה לסל ללא כיתוב אישי?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#46c1e1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'כן, תוסיף בכל זאת',
        cancelButtonText: 'חזור להקליד'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeAddToCart();
        }
      });
    } else {
      this.executeAddToCart();
    }
  }

  // פונקציית הביצוע הסופית - קוראים לה רק אחרי האישורים
  private executeAddToCart() {
    if (this.currentProduct) {
      const customProduct = {
        productId: this.currentProduct.productId,
        name: this.productName,
        price: this.productPrice,
        imageUrl: `${environment.imgPath}/this.productImage`,
        color: this.selectedColor,
        customText: this.userText || 'ללא כיתוב'
      };

      this.cartService.addToCart(customProduct);

      Swal.fire({
        title: 'איזה כיף!',
        text: `המוצר ${this.productName} נוסף לסל בהצלחה`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
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
// product-card.component.ts

saveProduct() {
  // 1. בדיקות תקינות
  if (!this.productName.trim() || !this.productDescription.trim() || !this.selectedCategoryName) {
    Swal.fire('שגיאה', 'שם, תיאור וקטגוריה הם שדות חובה', 'error');
    return;
  }
  const categoryForServer = {
    categoryName: this.selectedCategoryName 
  };
  // 2. בניית אובייקט הנתונים - שימי לב למבנה ה-Category
  const productData: ProductDTO = {
    ...this.currentProduct, // שומר על נתונים שלא בטופס
    productId: this.productId,
    productName: this.productName,
    price: this.productPrice,
    description: this.productDescription,
    imageUrl: this.productImage,
    colors: [...this.colors],
    toptext: this.currentProduct?.toptext || 'באהבה גדולה',
    // כאן התיקון הקריטי עבור ה-C#
    category: categoryForServer as any
  };

  // 3. שליחה לשרת
  if (this.productId === 0) {
    this.productService.addProduct(productData).subscribe({
      next: (res) => {
        Swal.fire('מזל טוב!', 'המוצר נוסף למערכת', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => Swal.fire('אופס', 'ההוספה נכשלה', 'error')
    });
  } else {
    this.productService.updateProduct(this.productId, productData).subscribe({
      next: (res) => {
        this.currentProduct = res;
        this.isEditing = false;
        Swal.fire('עודכן!', 'השינויים נשמרו בהצלחה', 'success');
      },
      error: (err) => Swal.fire('שגיאה', 'העדכון נכשל (ודאי שכל השדות מלאים)', 'error')
    });
  }
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
// --- לוגיקת ניהול (Admin) ---

editProduct() {
  if (!this.currentProduct) return; // הגנה
  this.isEditing = true;
  this.originalProductSnapshot = JSON.stringify({
    name: this.productName,
    price: this.productPrice,
    desc: this.productDescription,
    img: this.productImage,
    colors: [...this.colors]
  });
}


  resetToDefault() {
    if (this.originalProductSnapshot) {
      const original = JSON.parse(this.originalProductSnapshot);
      
      // החזרת הערכים מה-Snapshot לשדות בטופס
      this.productName = original.name;
      this.productPrice = original.price;
      this.productDescription = original.desc;
      this.productImage = original.img;
      this.colors = [...original.colors];

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'הנתונים שוחזרו לגרסה האחרונה שנשמרה',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  cancelEdit() {
    if (this.productId === 0) {
      this.router.navigate(['/products']); // או לדף הבית
    } else {
      this.isEditing = false;
      this.resetToDefault();
    }
  }
  
}