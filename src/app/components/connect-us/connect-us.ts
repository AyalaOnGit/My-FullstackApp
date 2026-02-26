import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; // ייבוא ה-Card
import { ButtonModule } from 'primeng/button'; // ייבוא הכפתורים
import { DividerModule } from 'primeng/divider'; // אם השתמשת ב-Divider

@Component({
  selector: 'app-connect-us',
  imports: [CommonModule, 
    CardModule, 
    ButtonModule, 
    DividerModule],
  templateUrl: './connect-us.html',
  styleUrl: './connect-us.scss',
})
export class ConnectUs {
    // מספר הטלפון שלכם (כולל קידומת בינלאומית בלי ה-0 הראשון)
    phoneNumber: string = '972501234567'; 
    businessName: string = 'GiftForU';
  
    openWhatsapp() {
      const message = encodeURIComponent(`היי ${this.businessName}, אשמח לקבל פרטים נוספים על מתנה בעיצוב אישי!`);
      const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
      
      // פתיחת הקישור בחלון חדש
      window.open(url, '_blank');
    }
}

