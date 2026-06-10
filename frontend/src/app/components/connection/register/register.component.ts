import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormControl, Validators, AbstractControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../header1/header';
import { UserService } from '../../../services/user.service';
import { UserDTO } from '../../../models/user.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ Header,CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  
  styleUrls: [ './register.component.css', '../connection.component.css']
})
export class RegisterComponent {

  private userService = inject(UserService);
  private router=inject(Router);
  @Output() switchMode=new EventEmitter<void>();
  switchToLogin(){
    this.switchMode.emit();
  }
  
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  
  registerForm !:FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'firstName': new FormControl(null, [Validators.required]),
      'lastName': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl(null, [Validators.required])
    },{validators: [this.passwordMatchValidator]});

    this.registerForm.get('password')?.valueChanges.pipe(
      debounceTime(20),
      distinctUntilChanged()).subscribe(value=>{
        this.checkPasswordStrength();
      });
  }

  

  passwordMatchValidator=(form: AbstractControl)=> {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password===confirmPassword? null : { 'mismatch': true }; 
  }

  successMessage: string = '';

  onSubmit(){
    if(this.registerForm.valid){
      const formValues=this.registerForm.value;

      const newUser: UserDTO = 
      {
        userId: 0,
        userEmail: formValues.email,
        userFirstName: formValues.firstName,
        userLastName: formValues.lastName,
        role: 'user'
      };
      
      const password = formValues.password;

      this.userService.register(newUser,password).subscribe
      ({
        next: (user)=>{
          const name = user.userFirstName ?? (user as any).UserFirstName ?? '';
          Swal.fire({
            title: `ברוך הבא, ${name}! ✨`,
            text: 'נרשמת בהצלחה',
            icon: 'success',
            iconColor: '#46d9e1',
            confirmButtonColor: '#46d9e1',
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.router.navigate(['/home']));
        },
        error: (err)=>{
          alert(err.error || 'שגיאה ברישום המשתמש');
        }
      });
    }
    else{
    this.registerForm.markAllAsTouched();  
    }
  }

  strength: number = 0;
strengthColor: string = '#ccc';

// checkPasswordStrength() {
//   const password = this.registerForm.get('password')?.value;
//   if (!password) return;

//   // שליחה לשרת (נניח שהנתיב הוא /api/check-strength)
//   this.http.post<any>('YOUR_SERVER_URL/api/check-strength', { password })
//     .subscribe(res => {
//       // נניח שהשרת מחזיר מספר בין 0 ל-100
//       this.strength = res.score; 
//       this.updateColor();
//     });
// }

// updateColor() {
//   if (this.strength < 30) this.strengthColor = '#ff4d4d'; // אדום - חלש
//   else if (this.strength < 70) this.strengthColor = '#ffd700'; // צהוב - בינוני
//   else this.strengthColor = '#4ed8d8'; // טורקיז - חזק
// }

checkPasswordStrength() {
  const password = this.registerForm.get('password')?.value;

  if (!password) {
    this.strength = 0;
    this.strengthColor = '#eee';
    return;
  }

  this.userService.checkPasswordStrength(password).subscribe({
    next: (res)=>{
      this.strength=res.level*25;
      this.updateColor(this.strength);
    },
    error: (err)=>{
      console.error('Password check failed',err)
    }
  });
}

updateColor(score: number) {
  if (score <= 30) {
    this.strengthColor = '#ff4d4d'; // אדום - חלש
  } else if (score <= 60) {
    this.strengthColor = '#ffd700'; // צהוב - בינוני
  } else {
    this.strengthColor = '#4ed8d8'; // טורקיז - חזק (הצבע מהאתר שלך)
  }
}

  

}
