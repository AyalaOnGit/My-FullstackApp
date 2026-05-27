import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { Header } from '../header1/header';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [Header,CommonModule,RegisterComponent,LoginComponent],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent {
  showPage:boolean[]=[true,false];


  switchComp(){
    this.showPage[0]=!this.showPage[0];
    this.showPage[1]=!this.showPage[1];
      
  }

}
