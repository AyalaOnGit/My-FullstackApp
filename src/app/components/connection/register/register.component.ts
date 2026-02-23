import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormControl, Validators, AbstractControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../header1/header';
import { UserService } from '../../../services/user.service';
import { UserDTO } from '../../../models/user.model';


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
  
  registerForm !:FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'firstName': new FormControl(null, [Validators.required]),
      'lastName': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl(null, [Validators.required])
    },{validators: [this.passwordMatchValidator]});
  }

  

  passwordMatchValidator=(form: AbstractControl)=> {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password===confirmPassword? null : { 'mismatch': true }; 
  }

  onSubmit(){
    if(this.registerForm.valid){
      const formValues=this.registerForm.value;

      const newUser: UserDTO = 
      {
        UserId: 0,
        UserEmail: formValues.email,
        UserFirstName: formValues.firstName,
        UserLastName: formValues.lastName,
        Role: 'user'
      };
      
      const password = formValues.password;

      //קריאה לשרת
      this.userService.register(newUser,password).subscribe
      ({
        next: (user)=>{
          console.log('Registration successful',user);
          this.router.navigate(['/home']); 
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

  // סימולציה של בדיקת חוזק (לפי אורך הסיסמה בינתיים)
  // כשתתחברי לשרת, כאן תבוא הקריאה ל-http.post
  let score = 0;
  if (password.length > 3) score = 30;
  if (password.length > 6) score = 60;
  if (password.length > 9) score = 100;

  this.strength = score;
  this.updateColor(score);
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
