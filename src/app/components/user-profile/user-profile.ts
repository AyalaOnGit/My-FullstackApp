import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea'; // הנתיב החדש
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import { inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule,Header,Footer1,CommonModule,ReactiveFormsModule,FormsModule,InputTextModule,TextareaModule,ButtonModule,DividerModule,IconFieldModule, InputIconModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router); // <--- הוסיפי את השורה הזו כאן

  profileForm!: FormGroup;
  isEditing = false;
  originalValues: any;
  feedbackText: string = '';

  // בתוך ה-UserProfile class
  ngOnInit(): void {
    // 1. הגדרת המבנה
    this.profileForm = this.fb.group({
      userId: [0],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      phon: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      role: ['user'],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  
    // 2. מילוי הנתונים
    const user = this.userService.currentUser();
    console.log('User from storage:', user); // בדיקה ב-Console לראות מה חוזר
  
    if (user) {
      this.profileForm.patchValue({
        // אנחנו בודקים גם אות קטנה וגם אות גדולה כדי למנוע טעויות מה-JSON
        userId: user.UserId ?? (user as any).userId ?? 0,
        userFirstName: user.UserFirstName ?? (user as any).userFirstName ?? '',
        userLastName: user.UserLastName ?? (user as any).userLastName ?? '',
        phon: user.Phon ?? (user as any).phon ?? '',
        userEmail: user.UserEmail ?? (user as any).userEmail ?? '',
        address: user.Address ?? (user as any).address ?? '',
        city: user.City ?? (user as any).city ?? '',
        role: user.Role ?? (user as any).role ?? 'user'
      });
    }
  
    this.originalValues = this.profileForm.getRawValue();
    this.profileForm.disable();
  }
saveProfile() {
  if (this.profileForm.valid) {
    const formValues = this.profileForm.getRawValue();
    const { password, ...userData } = formValues;

    this.userService.updateUser(userData.userId, userData, password).subscribe({
      next: (updatedUser) => {
        // 1. העדכון ב-LocalStorage וב-Signal כבר קרה בתוך ה-Service (ב-tap)
        
        // 2. עדכון מצב העריכה מקומית
        this.originalValues = { ...updatedUser }; 
        this.isEditing = false;
        this.profileForm.disable();
        
        Swal.fire('נשמר!', 'הפרטים שלך עודכנו במערכת ובמכשיר זה', 'success');
      },
      error: (err) => {
        Swal.fire('שגיאה', 'עדכון הפרטים נכשל. ודא שהסיסמה נכונה', 'error');
      }
    });
  }
}
  toggleEdit() {
    const passwordControl = this.profileForm.get('password');
  
    if (this.isEditing) {
      // חוזרים למצב תצוגה
      this.profileForm.patchValue(this.originalValues);
      passwordControl?.clearValidators(); // מסיר דרישת סיסמה כשלא עורכים
      this.profileForm.disable();
    } else {
      // עוברים למצב עריכה
      this.profileForm.enable(); 
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]); // מחזיר דרישה רק בעריכה
      passwordControl?.setValue(''); 
      
      // מיקוד אוטומטי (אופציונלי): גורם לאנגולר "להתעורר" על כל השדות
      this.profileForm.markAsUntouched();
    }
    
    passwordControl?.updateValueAndValidity();
    this.isEditing = !this.isEditing;
    this.cdr.detectChanges(); 
  }

  goToOrderHistory() {
    this.router.navigate(['/order-history']); // ניווט לנתיב שהגדרת ב-Routes
  }

  sendFeedback(message: string) {
    const adminEmail = 'admin@yourstore.com';
    const subject = 'משוב חדש מהאתר';
    const body = encodeURIComponent(message);
    
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    
    console.log('המשוב נשלח בהצלחה');
  }
  }
