import { Component, inject, OnInit, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../services/cart';
import { UserService } from '../../services/user.service';
import { SearchStateService } from '../../services/search-state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);
  public userService = inject(UserService);
  public cart = inject(Cart);
  private searchState = inject(SearchStateService);

  searchQuery = '';

  onSearch() {
    const q = this.searchQuery.trim();
    if (q.length > 2) {
      this.router.navigate(['/products']);
      this.searchState.search(q);
    }
  }

  onSearchKey(e: KeyboardEvent) {
    if (e.key === 'Enter') this.onSearch();
  }

  onSearchInput() {
    if (this.searchQuery.length === 0) {
      this.searchState.clear();
    }
  }

  // שימוש ב-computed כדי שהתפריט יתעדכן אוטומטית כשהמשתמש מתחבר/מתנתק
  profileMenuItems = computed<MenuItem[]>(() => {
    const user = this.userService.currentUser(); // גישה לסיגנל
    
    return [
      {
        items: [
          // הצגת התחברות רק אם אין משתמש
          { 
            label: 'התחברות', 
            icon: 'pi pi-sign-in', 
            visible: !user,
            command: () => this.router.navigate(['/connection']) 
          },
          { separator: true, visible: !user },
          
          // שדות שמופיעים רק אם יש משתמש
          { 
            label: 'פרופיל אישי', 
            icon: 'pi pi-user', 
            routerLink: '/profile', 
            visible: !!user 
          },
          { 
            label: 'הזמנות שלי', 
            icon: 'pi pi-shopping-bag', 
            routerLink: '/order-history', 
            visible: !!user 
          },
          { separator: true, visible: !!user },
          { 
            label: 'התנתקות', 
            icon: 'pi pi-power-off', 
            visible: !!user,
            command: () => this.disengagement() 
          }
        ]
      }
    ];
  });

  // פונקציה לבדיקת חיבור (אם בכל זאת תרצי להשתמש בה בכפתור חיצוני)
  conection() {
    const user = this.userService.currentUser(); // תיקון: שימוש בסיגנל
    if (user) {
      Swal.fire({
        title: '?להתנתק',
        text: `את/ה כבר מחובר למערכת בשם ${user.userFirstName ?? user.UserFirstName} ${user.userLastName ?? user.UserLastName}`,
        icon: 'warning',
        iconColor: '#46d9e1',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#46d9e1',
        confirmButtonText: 'להתנתק',
        cancelButtonText: 'להישאר מחובר'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.logout();
          this.router.navigate(['/connection']);
        }
      });
    } else {
      this.router.navigate(['/connection']);
    }
  }

  disengagement() {
    Swal.fire({
      title: 'את/ה בטוח/ה?',
      text: 'תוכל/י לשוב ולהתחבר מחדש בהמשך',
      icon: 'warning',
      iconColor: '#46d9e1',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#46d9e1',
      confirmButtonText: 'להתנתק',
      cancelButtonText: 'להישאר מחובר'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.logout();
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit() {}

  addNewProduct() {
    const productId = 0;
    this.router.navigate(['/products', productId]);
  }
}