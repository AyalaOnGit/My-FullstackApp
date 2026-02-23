import { Injectable, Signal, signal } from '@angular/core';
import { ProductDTO } from '../models/product.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  private productsSignal=signal<ProductDTO[]>([
  {ProductId: 1, ProductName: 'ספל קרמיקה מעוצב', Description: 'ספל קרמיקה עם עיצוב ייחודי, מתאים לשתיית קפה או תה.', price: 75.25, imageUrl: 'assets/productsImages/cup_of_coffee.png',CategoryDTO:{categoryName:'כלי בית'},colors:['Red', 'Blue', 'Green'], popularColor:'Red', topText:'שתה בכיף !'},
  {ProductId: 2, ProductName: 'סט צלחות עץ', Description: 'סט של 4 צלחות עץ טבעיות, מושלם לאירוח או לשימוש יומיומי.', price: 300.00, imageUrl: 'assets/productsImages/Wooden_plate_a.png',CategoryDTO:{categoryName:'כלי בית'},colors:['Natural', 'Dark Brown'], popularColor:'Natural', topText:'בתיאבון !'},
  {ProductId: 3, ProductName: 'מנורת לילה בצורת ירח', Description: 'מנורת לילה רכה בצורת ירח, יוצרת אווירה נעימה בחדר השינה.', price: 120.00, imageUrl: 'assets/productsImages/Moon_night_light.jpg',CategoryDTO:{categoryName:'תאורה'},colors:['White', 'Yellow'], popularColor:'White', topText:'לילה טוב !'},
  {ProductId: 4, ProductName: 'מחזיק מפתחות מעוצב', Description: 'מחזיק מפתחות עם עיצוב מודרני, מתאים לכל סוגי המפתחות.', price: 45.00, imageUrl: 'assets/productsImages/key_ring.jpg',CategoryDTO:{categoryName:'אביזרים'},colors:['Silver', 'Gold'], popularColor:'Silver', topText:'תזכור אותי !'},
  {ProductId: 5, ProductName: 'סט כלי מטבח סיליקון', Description: 'סט של 5 כלי מטבח עשויים סיליקון עמיד בחום, כולל כף, מרית ועוד.', price: 150.00, imageUrl: 'assets/productsImages/Silicone_kitchen_utensils.png',CategoryDTO:{categoryName:'כלי מטבח'},colors:['Gray'], popularColor:'Gray', topText:'בישול מהנה !'},
  {ProductId: 6, ProductName: 'ספל קרמיקה מעוצב', Description: 'ספל קרמיקה עם עיצוב ייחודי, מתאים לשתיית קפה או תה.', price: 75.25, imageUrl: 'assets/productsImages/cup_of_coffee.png',CategoryDTO:{categoryName:'כלי בית'},colors:['Red', 'Blue', 'Green'], popularColor:'Red', topText:'שתה בכיף !'},
  {ProductId: 7, ProductName: 'סט צלחות עץ', Description: 'סט של 4 צלחות עץ טבעיות, מושלם לאירוח או לשימוש יומיומי.', price: 300.00, imageUrl: 'assets/productsImages/Wooden_plate_a.png',CategoryDTO:{categoryName:'כלי בית'},colors:['Natural', 'Dark Brown'], popularColor:'Natural', topText:'בתיאבון !'},
  {ProductId: 8, ProductName: 'מנורת לילה בצורת ירח', Description: 'מנורת לילה רכה בצורת ירח, יוצרת אווירה נעימה בחדר השינה.', price: 120.00, imageUrl: 'assets/productsImages/Moon_night_light.jpg',CategoryDTO:{categoryName:'תאורה'},colors:['White', 'Yellow'], popularColor:'White', topText:'לילה טוב !'},
  {ProductId: 9, ProductName: 'מחזיק מפתחות מעוצב', Description: 'מחזיק מפתחות עם עיצוב מודרני, מתאים לכל סוגי המפתחות.', price: 45.00, imageUrl: 'assets/productsImages/key_ring.jpg',CategoryDTO:{categoryName:'אביזרים'},colors:['Silver', 'Gold'], popularColor:'Silver', topText:'תזכור אותי !'},
  {ProductId: 10, ProductName: 'סט כלי מטבח סיליקון', Description: 'סט של 5 כלי מטבח עשויים סיליקון עמיד בחום, כולל כף, מרית ועוד.', price: 150.00, imageUrl: 'assets/productsImages/Silicone_kitchen_utensils.png',CategoryDTO:{categoryName:'כלי מטבח'},colors:['Gray'], popularColor:'Gray', topText:'בישול מהנה !'},
  // {ProductId: 6, ProductName: 'תיק גב מעוצב', Description: 'תיק גב אופנתי עם עיצוב ייחודי, מתאים לשימוש יומיומי או לטיולים.', price: 200.00, imageUrl: 'productsImages/', CategoryDTO:{CategoryName:'תיקים'},colors:['Red', 'Blue', 'Green'], popularColor:'Red', topText:'יום טוב !'},
  ]
  );

  readonly products = this.productsSignal.asReadonly();

  constructor() { }

  getProducts(): Observable<Signal<ProductDTO[]>> {
      return of(this.products); // of הופך את המערך ל-Observable
  }

  getProductById(productId: number): ProductDTO | undefined {
    return this.productsSignal().find(product => product.ProductId === productId);
  }

  deleteProduct(productId:number):void
  {
    this.productsSignal.update(allProducts=>allProducts.filter(p=>p.ProductId !== productId));
    console.log(`Product ${productId} deleted`);

  }

  updateProduct(updatedProduct:ProductDTO):void{
    const idForUpdate=updatedProduct.ProductId;

    this.productsSignal.update(allProduct=>
      allProduct.map(p=>
      p.ProductId===idForUpdate? {...updatedProduct}:p)
    );
    

    console.log(`Product ${updatedProduct.ProductId} updated successfully`);
  }

  addProduct(newProduct: ProductDTO):void{
    this.productsSignal.update(all=>{
      const newId=all.length>0 ?Math.max(...all.map(p=>p.ProductId))+1:1;

      const productWithId={...newProduct, ProductId:newId};
      return [...all, productWithId]
    });

    console.log(`Product ${newProduct.ProductId} added successfully`);

  }
}