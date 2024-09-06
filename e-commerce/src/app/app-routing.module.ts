import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectComponent } from './project/project.component';
import { CartComponent } from './cart/cart.component';
import { ShopComponent } from './shop/shop.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CreatecartComponent } from './createcart/createcart.component';

@NgModule({
  imports: [
      RouterModule.forRoot([
          { path: '', component: HomeComponent},
          { path: 'register', component: RegisterComponent},
          { path: 'login', component: LoginComponent},
          { path: 'shop', component: ShopComponent},
          { path: 'createcart', component: CreatecartComponent},
          { path: 'contact', component: ProjectComponent},
          { path: 'cart', component: CartComponent},
          { path: 'wishlist', component: WishlistComponent},
      ],  { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
