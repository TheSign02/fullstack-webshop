import { Routes } from '@angular/router';
import { Hero01Component } from './hero-01/hero-01.component';
import { LoginEmailComponent } from './login-email/login-email.component';
import { LoginOauthComponent } from './login-oauth/login-oauth.component';
import { LoginGoogleComponent } from './login-google/login-google.component';
import { ProductPage1Component } from './product-page-1/product-page-1.component';
import { ShopComponent } from './shop/shop.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { ProductsGridComponent } from './products-grid/products-grid.component';
import { ResetPasswd } from './reset-passwd/reset-passwd.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: Hero01Component },
  { path: 'about', component: AboutComponent },
  { path: 'login-email', component: LoginEmailComponent },
  { path: 'reset-passwd', component: ResetPasswd },
  { path: 'login-oauth', component: LoginOauthComponent },
  { path: 'login-google', component: LoginGoogleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product/:id', component: ProductPage1Component },
  { path: 'shop', component: ShopComponent },
  { path: 'shop-all', component: ProductsGridComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' },
];
