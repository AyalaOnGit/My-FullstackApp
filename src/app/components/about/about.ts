import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; // ייבוא ה-Card
import { ButtonModule } from 'primeng/button'; // ייבוא הכפתורים
import { DividerModule } from 'primeng/divider'; // אם השתמשת ב-Divider
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, 
    CardModule, 
    ButtonModule, 
    DividerModule,
    RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

}
