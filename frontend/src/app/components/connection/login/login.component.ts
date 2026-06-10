import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormControl, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../connection.component.css']
})
export class LoginComponent {

  @Output() switchMode=new EventEmitter<void>();

  private userService=inject(UserService);
  private router=inject(Router);

  switchToRegister(){
    this.switchMode.emit();
  }

  loginForm !:FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            const name = user.userFirstName ?? user.UserFirstName ?? '';
            const isAdmin = this.userService.isAdmin();
            Swal.fire({
              title: isAdmin ? `ברוך הבא, ${name} 👑` : `שלום, ${name}! 😊`,
              text: isAdmin ? 'נכנסת כמנהל' : 'נכנסת בהצלחה',
              icon: 'success',
              iconColor: '#46d9e1',
              confirmButtonColor: '#46d9e1',
              timer: 1500,
              showConfirmButton: false
            }).then(() => this.router.navigate(['/home']));
          } else {
            Swal.fire({
              title: 'פרטים לא נכונים',
              text: 'אימייל או סיסמא שגויים',
              icon: 'error',
              confirmButtonColor: '#46d9e1'
            });
          }
        },
        error: (err) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'פרטים לא נכונים',
              text: 'אימייל או סיסמא שגויים',
              icon: 'warning',
              confirmButtonColor: '#46d9e1'
            });
          } else {
            Swal.fire({
              title: 'שגיאה',
              text: 'אירעה שגיאה בחיבור לשרת',
              icon: 'error',
              confirmButtonColor: '#46d9e1'
            });
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}