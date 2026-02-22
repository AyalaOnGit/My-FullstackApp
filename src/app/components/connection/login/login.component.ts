import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormControl, Validators, AbstractControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

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

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);

      const {email, password}=this.loginForm.value;

      if(this.userService.login(email, password)){
        if(this.userService.isAdmin()){
          console.log("ברוך הבא אדמין!");
        }
        else{
          console.log("ברוך הבא לקוח!");
        }

        this.router.navigate(['/home']); 
      }
      else{
        alert("?פרטים לא נכונים. לקוחות חדשים")
      }  
    }
    else{
    this.loginForm.markAllAsTouched();  
    }
  }
}
