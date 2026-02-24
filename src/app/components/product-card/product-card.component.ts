import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Header } from '../header1/header';
import { Footer1 } from '../footer1/footer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [Footer1,Header,FormsModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private productService=inject(ProductService);
  private router=inject(ActivatedRoute);
  private router2=inject(Router)
  private orderService=inject(OrderService);
  
  private userService=inject(UserService);

  isAdmin=this.userService.isAdmin;

  currentProduct!: ProductDTO;

  productId :number=1;
  ngOnInit() {
    const idFromRoute = this.router.snapshot.paramMap.get('id');
    this.productId = idFromRoute ? Number(idFromRoute) : 0;
  
    if (this.productId === 0) {
      this.isEditing = true;
      this.productName = '';
      this.productPrice = 0;
      this.productDescription = '';
      this.productImage = 'assets/placeholder.jpg';
      this.colors = [];
    } else {
      // קריאה לשרת - אנחנו נרשמים (subscribe) כדי לקבל את המוצר כשיגיע
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          // עכשיו 'product' הוא אובייקט מסוג ProductDTO אמיתי
          this.currentProduct = product;
          
          this.productName = product.productName;
          this.productPrice = product.price;
          this.productImage = product.imageUrl ?? 'assets/images/default-product.png';
          this.productDescription = product.description ?? 'אין תיאור זמין למוצר זה';
          this.colors = [...product.colors];
  
          this.selectedColor = '';
          this.userText = '';
          this.showToast = false;
        },
        error: (err) => {
          console.error('שגיאה בטעינת המוצר:', err);
          // כאן כדאי להוסיף ניווט חזרה או הודעת שגיאה למשתמש
        }
      });
    }
  }

  productName: string = 'מוצר לדוגמא';
  productPrice: number = 99.99;
  productImage: string = 'assets/productsImages/cup_of_coffee.png';
  productDescription: string = 'פה יש תיאור על המוצר לדוגמא. זה יכול להיות כל דבר שתרצה להוסיף כדי לתאר את המוצר שלך בצורה טובה יותר.';
  colors: string[] = ['Red', 'Blue', 'Green'];
  selectedColor: string = '';
  userText: string = 'your text here';
  showToast: boolean = false;

  selectColor(color: string) {
    this.selectedColor = color;
  }

  //הוספה לסל כולל ולידציה שיש טקסט לקוח
  addToCart(){
    if (!this.userText || this.userText.trim() === '') {
      Swal.fire({
          title: 'אופססס',
          text: "...נראה ששכחת להוסיף טקסט",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#46c1e1',
          cancelButtonColor: '#d33',
          confirmButtonText: 'להמשיך בכל אופן',
          cancelButtonText: 'ביטול'
        }).then((result) => {
          if (result.isConfirmed)
            this.addToCartLogic();
          });
        }
      else
        this.addToCartLogic();
  }
  
  addToCartLogic() {
      alert(`המוצר ${this.productName} בצבע ${this.selectedColor} עם הטקסט: "${this.userText}" נוסף לסל!`);
}


  copyLink() {
    const url=window.location.href;
    navigator.clipboard.writeText(url).then(() => {
    this.showToast=true;

    // מעלימים את ההודעה אוטומטית אחרי 3 שניות
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
    }).catch(err => {
      console.error('שגיאה בהעתקת הקישור: ', err);
    });
  }


  //פונקציות למנהל

  isEditing: boolean = false;
  originalProductSnapshot!: string;

  editProduct(){
    this.isEditing=true;

    this.originalProductSnapshot=JSON.stringify({
      name: this.productName,
      price: this.productPrice,
      desc:this.productDescription,
      img:this.productImage,
      colors: this.colors
    });
  }

  cancelEdit(){
    this.isEditing=false;
    this.ngOnInit();
  }

  saveProduct(){

    //validations
    //1. fileds not empties
    if(!this.productName.trim() || !this.productDescription.trim())
    {
      Swal.fire('שם המוצר והתיאור אינם יכולים להיות ריקים','!שגיאה','error')
      return;
    }

    //2. price is valid
    if(this.productPrice <=0)
    {
      Swal.fire('המחיר חייב להיות גבוה מ-0','!שגיאה','error');
      return;
    }

    //3.there is a change?
    const currentSnapshot=JSON.stringify({
      name: this.productName,
      price: this.productPrice,
      desc:this.productDescription,
      img:this.productImage,
      colors: this.colors
    });

    if(currentSnapshot===this.originalProductSnapshot)
    {
      Swal.fire('לא בוצע שום שינוי בפרטי המוצר','!שים/י לב','info');
      return;
    }
    



    const updatedData: ProductDTO = {
      ...this.currentProduct,
      productName: this.productName,
      price: this.productPrice,
      description: this.productDescription,
      imageUrl: this.productImage,
      colors: [...this.colors]
    };
    
    // תיקון הקריאה: העברת ה-ID כפרמטר ראשון והרשמה (subscribe) לבקשה
    this.productService.updateProduct(this.productId, updatedData).subscribe({
      next: (response) => {
        // עדכון מקומי רק לאחר הצלחת הבקשה בשרת
        this.currentProduct = response; 
        this.isEditing = false;
        Swal.fire('!נשמר', 'פרטי המוצר עודכנו בהצלחה', 'success');
      },
      error: (err) => {
        console.error('שגיאה בעדכון המוצר:', err);
        Swal.fire('אופס...', 'העדכון נכשל, נסה שנית מאוחר יותר', 'error');
      }
    });
  }

  onFileSelect(event:any){
    const file=event.target.files[0];
    if(file){
      const reader=new FileReader();
      reader.onload=(e:any)=>{
        this.productImage=e.target.result;
      };
        reader.readAsDataURL(file);
    }    
  }

  addColor(newColor:string){

    const cleanedColor = newColor?.trim();

    if (!cleanedColor) {
      Swal.fire('!!הי אוי', 'לא ניתן להוסיף צבע ללא שם', 'warning');
      return;
    }

    if (this.colors.includes(cleanedColor)) {
      Swal.fire('הי אוי', 'הצבע הזה כבר קיים ברשימה', 'info');
      return;
    }

    if (!this.isValidColor(cleanedColor)) {
      Swal.fire('שגיאה', `הערך "${cleanedColor}" אינו צבע תקין`, 'error');
      return;
    }

    this.colors.push(cleanedColor);
  }

    // פונקציית עזר לבדיקת תקינות צבע
  isValidColor(strColor: string): boolean {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  }

  
  removeColor(index:number)
  {
    this.colors.splice(index,1);
  }

  resetToDefault() {
  Swal.fire({
    title: 'האם לשחזר ערכים?',
    text: "כל השינויים שביצעת בעמוד זה יימחקו והנתונים יחזרו למצבם המקורי.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#46c1e1',
    cancelButtonColor: '#d33',
    confirmButtonText: 'כן, שחזר',
    cancelButtonText: 'ביטול'
  }).then((result) => {
    if (result.isConfirmed) {
      // החזרת כל המשתנים לערכים המקוריים מהאובייקט שנמשך מה-Service
      this.productName = this.currentProduct.productName;
      this.productPrice = this.currentProduct.price;
      this.productDescription = this.currentProduct.description??'אין תיאור זמין למוצר זה';
      this.productImage = this.currentProduct.imageUrl??'assets/images/default-product.png';
      this.colors = [...this.currentProduct.colors]; // חשוב: ליצור העתק חדש!

      Swal.fire('שוחזר!', 'הנתונים חזרו לברירת המחדל.', 'success');
    }
  });
}

  deleteProduct() {

      Swal.fire({
      title: '?האם את/ה בטוחה',
      text: "!לא תוכל/י לבטל פעולה זו",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#46c1e1',
      cancelButtonColor: '#d33',
      confirmButtonText: '!כן, בצע',
      cancelButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        //בדיקה אם המוצר נמצא בהזמנות קיימות
        const statuses=this.orderService.getStatuses();
        const shippedIndex=statuses.indexOf('נשלח');

        const ordersWithProduct=this.orderService.getOrdersByProductId(this.currentProduct.productId);
        console.log(ordersWithProduct);
        const HasPandingOrders=ordersWithProduct?.find(order=>statuses.indexOf(order.status)<shippedIndex);

        
        if(HasPandingOrders)
        {
          Swal.fire({
          title: '!שים לב',
          text: '...יש לך הזמנות שטרם נשלחו\n חבל לאכזב את הלקוחות שלך',
          icon: 'warning',
          confirmButtonText: 'הבנתי',
          allowOutsideClick: false 
          });
          return;
        }
        else{
            this.productService.deleteProduct(this.currentProduct.productId);
            Swal.fire({
              title: 'הפעולה הצליחה',
              text: 'המוצר נמחק מהמערכת',
              icon: 'success',
              confirmButtonText: 'הבנתי',
              allowOutsideClick: false 
              });
            this.router2.navigate(['/home']);
        }
      }
    });

  }



}