import { Routes } from '@angular/router';
import { ProductsPage } from './components/products-page/products-page';
import { CartPage } from './components/cart-page/cart-page';
import { UserProfile } from './components/user-profile/user-profile';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
    { path: '', component: ProductsPage }, // דף הבית
    { path: 'cart', component: CartPage },  // דף העגלה
    { path: 'profile', component: UserProfile },  // דף העגלה
   
    { path: 'checkout', component: CheckoutComponent },
    {path: 'products/:id', component: ProductCardComponent },
    {path: 'home', component: ProductsPage },
    {path: 'connection', component: ConnectionComponent },
    {path: 'order-history', component: OrderHistoryComponent},
  
    // 3. אופציונלי: "תופס" טעויות ושולח חזרה להתחלה
    { path: '**', redirectTo: '' }];
  

