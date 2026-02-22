import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Cart } from '../../services/cart';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);
  public userService = inject(UserService); // הזרקת ה-Service עם הסיגנלים
  public cart = inject(Cart);

  profileMenuItems: MenuItem[] = [];
      
  conection(){
    if(this.userService.getCurrentUser())
    {
      Swal.fire({
            title: '?להתנתק',
            text: ` ${this.userService.getCurrentUser()!.UserFirstName} ${this.userService.getCurrentUser()!.UserLastName} את/ה כבר מחובר למערכת בשם  `,
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
      }
        else{
          this.router.navigate(['/connection']);
        }
    // console.log(this.userService.getCurrentUser());
  }

  disengagement(){
    Swal.fire({
            title: 'את/ה בטוח/ה?',
            text: `תוכל/י לשוב ולהתחבר מחדש בהמשך`,
            icon: 'warning',
            iconColor: '#46d9e1',
            showCancelButton: true,
            confirmButtonColor:'#d33' ,
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

  ngOnInit() {
    this.profileMenuItems = [
      {
        // label: 'החשבון שלי',
        
        items: [
          {label: 'התחברות',icon: 'pi pi-sign-in',command: () => { this.conection();}},
          { separator: true },
          { label: 'פרופיל אישי', icon: 'pi pi-user', routerLink: '/profile' },
          { label: 'הזמנות שלי', icon: 'pi pi-shopping-bag', routerLink: '/order-history' },
          { separator: true },
          { label: 'התנתקות', icon: 'pi pi-power-off', command: ()=>{this.disengagement();} }
        ]
      }
    ];
  }

  //for admin
  addNewProduct(){
    
    const productId=0;
    console.log("Navigating to product with ID:", productId);

    this.router.navigate(['/products', productId]);
  }
}