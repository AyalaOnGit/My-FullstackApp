import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-footer',
  imports: [ButtonModule, DividerModule,RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer1 {

  phoneNumber: string = '972501234567'; 
  businessName: string = 'GiftForU';

  openWhatsapp() {
    const message = encodeURIComponent(`היי ${this.businessName}, הגעתי מהאתר ואשמח להתייעץ לגבי מתנה!`);
    const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }
}
