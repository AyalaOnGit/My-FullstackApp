import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCardMin } from './components/product-card-min/product-card';
import { ProductsPage } from './components/products-page/products-page';
import { Filter } from './components/filter/filter';
import { Pagination } from './components/pagination/pagination';
import { UserProfile } from './components/user-profile/user-profile';
import { Footer1 } from './components/footer1/footer';
import { Header } from './components/header1/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ProductCardMin,ProductsPage,Filter,Pagination,UserProfile,Footer1, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-pro');
}


// import { Component, OnInit } from '@angular/core';
// import { AudioService } from './audio.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html'
// })
// export class AppComponent implements OnInit {
//   constructor(private audioService: AudioService) {}

//   ngOnInit() {
//     // מומלץ להפעיל רק אחרי לחיצה ראשונה של המשתמש באתר
//     // כדי למנוע חסימה של הדפדפן
//   }

//   toggleMusic() {
//     // דוגמה לפונקציה שאפשר לקרוא לה מכפתור ב-HTML
//     this.audioService.play();
//   }
// }
