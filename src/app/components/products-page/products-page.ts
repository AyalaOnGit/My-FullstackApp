import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Imports של הרכיבים שלך
import { ProductCardMin } from '../product-card-min/product-card';
import { Filter } from '../filter/filter';
import { Pagination } from '../pagination/pagination'; // ודאי שזה השם הנכון של ה-Export בקובץ הפגינציה

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

// Services & Models
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { CartItem } from '../../models/product';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import { ProductDTO } from '../../models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule, 
    Footer1, 
    Header, 
    Filter, 
    ProductCardMin, 
    Pagination, 
    RouterLink, 
    ButtonModule, 
    DividerModule
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  public cart = inject(Cart);
  
  // הגדרות פגינציה
  currentPage: number = 1;
  pageSize: number = 2; // שיניתי ל-8 כדי שיהיה יותר נעים לעין, תשני חזרה ל-4 אם תרצי

  currentUserIsAdmin: boolean = false;

  // בתוך ProductsPage
  ngOnInit() {
    this.loadProducts();
    this.checkIfAdmin(); // בדיקה פעם אחת עבור כל הדף
  }

  checkIfAdmin() {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserIsAdmin = user?.role?.toLowerCase() === 'admin';
    }
  }

  // שורה 38 בערך - שינוי הטיפוס של המערכים
productList: ProductDTO[] = []; 
filteredList: ProductDTO[] = [];

// עדכון פונקציית הטעינה
loadProducts() {
  this.productService.getProducts().subscribe({
    next: (response: any) => {
      // חילוץ המערך מהתשובה (items או data)
      const productsFromApi = response.items || response.data || response;

      if (Array.isArray(productsFromApi)) {
        // אנחנו שומרים את האובייקטים כפי שהם מהשרת
        this.productList = productsFromApi;
        this.filteredList = [...this.productList];
        this.currentPage = 1;
        this.cdr.detectChanges();
      }
    },
    error: (err) => console.error('שגיאה בטעינה:', err)
  });
}

// עדכון פונקציית הסינון כדי שתתאים לשדות של ProductDTO
filterProducts(filters: any) {
  this.currentPage = 1;
  this.filteredList = this.productList.filter(product => {
    const matchesName = product.productName?.toLowerCase().includes(filters.name.toLowerCase());
    const matchesPrice = product.price >= (filters.minPrice ?? 0) && 
                         product.price <= (filters.maxPrice ?? Infinity);
    
    // סינון קטגוריה (בהנחה שב-Product יש שדה categoryId או categoryName)
    const matchesCategory = filters.category === 'all' || 
                            product.category?.value === filters.category;
    
    return matchesName && matchesPrice && matchesCategory;
  });
  this.cdr.detectChanges();
}
  // פונקציית ה-Getter שמבצעת את החיתוך בפועל לתצוגה
  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  // עדכון הדף כשהמשתמש לוחץ על הפגינציה
  changePage(newPage: number) {
    this.currentPage = newPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  // filterProducts(filters: any) {
  //   if (!this.productList.length) return;

  //   this.currentPage = 1; // תמיד חוזרים לדף ראשון בסינון חדש
  //   this.filteredList = this.productList.filter(product => {
  //     const matchesName = product.name?.toLowerCase().includes(filters.name.toLowerCase());
  //     const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
  //     const matchesCategory = filters.category === 'all' || product.category === filters.category;
      
  //     return matchesName && matchesPrice && matchesCategory;
  //   });
    
  //   this.cdr.detectChanges();
  // }

  viewProductCard(productId: number | string) {
    if (productId) {
      this.router.navigate(['/products', productId]);
    }
  }
}