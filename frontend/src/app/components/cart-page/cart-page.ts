import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    Header, Footer1, RouterLink, CurrencyPipe, CommonModule, 
    DividerModule, ButtonModule, CardModule, TooltipModule
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-in', style({ transform: 'translateX(-20px)', opacity: 0 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class CartPage implements OnInit {
  // שימוש ב-inject לניקיון הקוד
  public cartService = inject(Cart);
  private router = inject(Router);

  cartItems: any[] = [];

  ngOnInit() {
    this.refreshCart();
  }

  refreshCart() {
    this.cartItems = [...this.cartService.getItems()];
  }

  changeQuantity(item: any, delta: number) {
    this.cartService.updateQuantity(item, delta);
    this.refreshCart();
  }

  removeFromCart(item: any) {
    this.cartService.removeItem(item);
    this.refreshCart();
  }

  get totalAmount() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  goToCheckout() {
    const user = localStorage.getItem('loggedUser');
    
    if (!user) {
      Swal.fire({
        title: 'רגע אחד...',
        text: 'כדי לבצע הזמנה צריך להתחבר למערכת',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'להתחברות',
        cancelButtonText: 'ביטול',
        confirmButtonColor: '#46c1e1'
      }).then((result) => {
        if (result.isConfirmed) this.router.navigate(['/connection']);
      });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}