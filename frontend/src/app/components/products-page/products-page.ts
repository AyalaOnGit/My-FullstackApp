import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductCardMin } from '../product-card-min/product-card';
import { Filter } from '../filter/filter';
import { Pagination } from '../pagination/pagination';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { CartItem } from '../../models/product';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import { ProductDTO } from '../../models/product.model';
import { ChatService } from '../../services/chat.service';
import { SearchStateService } from '../../services/search-state.service';

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
  private chatService = inject(ChatService);
  private searchState = inject(SearchStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  public cart = inject(Cart);
  
  currentPage: number = 1;
  pageSize: number = 8;
  currentUserIsAdmin: boolean = false;
  isSemanticSearch = false;
  isSearching = false;
  lastFilters: any = null;
  pendingQuery = '';

  productList: ProductDTO[] = []; 
  filteredList: ProductDTO[] = [];

  isHomePage = false;

  ngOnInit() {
    this.isHomePage = this.router.url === '/' || this.router.url.startsWith('/?') || this.router.url === '/home';
    this.loadProducts();
    this.checkIfAdmin();
    this.searchState.query$.subscribe(q => {
      if (q === null) return;
      if (q === '') {
        this.pendingQuery = '';
        this.isSemanticSearch = false;
        this.filteredList = [...this.productList];
        this.currentPage = 1;
        this.cdr.detectChanges();
        return;
      }
      this.isSearching = true;
      this.cdr.detectChanges();
      const doSearch = () => {
        this.pendingQuery = q;
        const regularResults = this.productList.filter(p =>
          p.productName?.toLowerCase().includes(q.toLowerCase())
        );
        if (regularResults.length > 0) {
          this.isSearching = false;
          this.isSemanticSearch = false;
          this.filteredList = regularResults;
          this.currentPage = 1;
          this.cdr.detectChanges();
        } else {
          this.semanticSearch(q);
        }
      };
      if (this.productList.length > 0) {
        doSearch();
      } else {
        this.productService.getProducts().subscribe({
          next: (response: any) => {
            const data = response.items || response.data || response;
            if (Array.isArray(data)) {
              this.productList = data;
              this.filteredList = [...data];
            }
            doSearch();
          }
        });
      }
    });
  }

  checkIfAdmin() {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserIsAdmin = user?.role?.toLowerCase() === 'admin';
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        const productsFromApi = response.items || response.data || response;
        if (Array.isArray(productsFromApi)) {
          this.productList = productsFromApi;
          this.filteredList = [...this.productList];
          this.currentPage = 1;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('שגיאה בטעינה:', err)
    });
  }

  filterProducts(filters: any) {
    this.isSemanticSearch = false;
    this.currentPage = 1;
    this.lastFilters = filters;

    const filtered = this.productList.filter(product => {
      const matchesName = !filters.name || product.productName?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesPrice = product.price >= (filters.minPrice ?? 0) &&
                           product.price <= (filters.maxPrice ?? Infinity);
      const matchesCategory = filters.category === 'all' || !filters.category ||
                              product.category?.categoryName === filters.category?.categoryName;
      return matchesName && matchesPrice && matchesCategory;
    });

    if (filtered.length === 0 && filters.name?.trim().length > 2) {
      this.semanticSearch(filters.name.trim(), filters);
    } else {
      this.filteredList = filtered;
      this.cdr.detectChanges();
    }
  }

  semanticSearch(query: string, filters?: any) {
    this.isSearching = true;
    this.chatService.search(query).subscribe({
      next: (res) => {
        this.isSearching = false;
        this.isSemanticSearch = true;
        let results = res.results?.map((r: any) => ({
          productId: r.productId,
          productName: r.name,
          price: r.price,
          description: r.description,
          category: { categoryName: r.category },
          imageUrl: r.imageUrl,
          colors: r.colors || [],
          toptext: r.toptext || ''
        })) ?? [];

        // החל סינוני מחיר וקטגוריה על תוצאות הסמנטי
        if (filters) {
          results = results.filter((p: any) => {
            const matchesPrice = p.price >= (filters.minPrice ?? 0) &&
                                 p.price <= (filters.maxPrice ?? Infinity);
            const matchesCategory = filters.category === 'all' || !filters.category ||
                                    p.category?.categoryName === filters.category?.categoryName;
            return matchesPrice && matchesCategory;
          });
        }

        this.filteredList = results;
        this.currentPage = 1;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSearching = false;
        console.error('Semantic search error:', err);
      }
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  viewProductCard(productId: number | string) {
    if (productId) {
      this.router.navigate(['/products', productId]);
    }
  }
}
