import { Component, inject, OnInit } from '@angular/core';
import { ProductCardMin } from '../product-card-min/product-card';
import { Filter } from '../filter/filter';
import { Pagination } from '../pagination/pagination';
import { RouterLink, Router } from '@angular/router'; // איחוד אימפורטים
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Cart } from '../../services/cart';
import { CartItem } from '../../models/product';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-page',
  imports: [Footer1, Header, Filter, ProductCardMin, Pagination, RouterLink, ButtonModule, DividerModule],
  standalone: true,
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit{
  private productService = inject(ProductsService);
  private router = inject(Router);
  public cart = inject(Cart);

  productList: CartItem[] = [];
  filteredList: CartItem[] = [];
  currentPage: number = 1; // תמיד מתחילים מדף ראשון
  pageSize: number = 4;    

  currentUserIsAdmin: boolean = false; // שיניתי ל-true כדי שתוכלי לראות שהעריכה עובדת

  constructor() {}

  ngOnInit() {
    this.loadProducts();
  }

  // loadProducts() {
  //   this.productService.getProducts().subscribe((data) => {
  //     this.productList = data;
  //     this.filteredList = [...this.productList];
  //   });
  // }

  loadProducts() {
  this.productService.getProducts().subscribe((dataSignal) => {
    // 1. חילוץ המערך מתוך ה-Signal (כי dataSignal הוא Signal)
    const data = dataSignal(); 

    // 2. מיפוי הנתונים ל-CartItem
    if (data && Array.isArray(data)) {
      this.productList = data.map(item => ({
        id: item.ProductId,          
        name: item.ProductName,      
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.CategoryDTO?.categoryName,
        popularColor: item.popularColor
      }));

      this.filteredList = [...this.productList];
      console.log('Successfully loaded products:', this.productList);
    }
  });
}


  // פונקציה חדשה שתטפל בלחיצה על עריכה מהכרטיס
  handleEdit(product: CartItem) {
    console.log('עורך את המוצר:', product);
    // כאן בהמשך תוכלי לפתוח Dialog (פופ-אפ) לעריכה
  }

  filterProducts(filters: any) {
    this.currentPage = 1;
    this.filteredList = this.productList.filter(product => {
      // בדיקה אם השם מתאים
    const matchesName = product.name?.toLowerCase().includes(filters.name.toLowerCase());      
    
    // בדיקה שהמחיר גדול או שווה למינימום וגם קטן או שווה למקסימום
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice; 
        
      // בדיקה אם הקטגוריה מתאימה (אם יש לך שדה כזה במוצר)
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
  
      // המוצר יוצג רק אם הוא עומד בכל התנאים
      return matchesName && matchesPrice && matchesCategory;
    });
  }

  // פונקציה שמחזירה רק את המוצרים של הדף הנוכחי
  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  // פונקציה למעבר דף
  changePage(newPage: number) {
    this.currentPage = newPage;
    window.scrollTo(0, 0); // מקפיץ את הדף לראש הרשימה כדי שלא יצטרכו לגלול למעלה
  }

  //פונקציה לניווט
viewProductCard(productId: number | string) {
    console.log("Navigating to product with ID:", productId);
    if (productId) {
      this.router.navigate(['/products', productId]);
    } else {
      console.error("Cannot navigate: Product ID is undefined");
    }
  }
}
