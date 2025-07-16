import { Routes } from '@angular/router';
import { authGuard } from './authguard/auth/auth-guard';
import { Home } from './home/home';
import { Product } from './product/product';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { About } from './about/about';
import { Blog } from './blog/blog';
import { Profile } from './profile/profile';
import { Terms } from './terms/terms';
import { ReturnRefund } from './return-refund/return-refund';
import { Privacy } from './privacy/privacy';
import { Wiki } from './wiki/wiki';
import { Recipes } from './recipes/recipes';
import { BlogPage } from './blog-page/blog-page';
import { AdminLogin } from './admin/admin-login/admin-login';
import { Dashboard } from './admin/dashboard/dashboard';
import { ShopManagement } from './admin/shop-management/shop-management';
import { Addtocart } from './addtocart/addtocart';
import { Shop } from './shop/shop';
import { BlogManagement } from './admin/blog-management/blog-management';
import { ManageUser } from './admin/manage-user/manage-user';
import { ResetPasswordComponent } from './admin/reset-password-component/reset-password-component';
import { Address } from './address/address';
import { AdminOrderComponent } from './admin/admin-order-component/admin-order-component';
import { OrderlistUser } from './orderlist-user/orderlist-user';
import { ResetPosswordUser } from './reset-possword-user/reset-possword-user';
import { adminAuthGuard } from './authguard/admin-auth/admin-auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'contact', component: Contact },
  { path: 'term&cond', component: Terms },
  { path: 'return&refund', component: ReturnRefund },
  { path: 'privacy', component: Privacy },
  { path: 'wiki', component: Wiki },
  { path: 'recipes', component: Recipes },
  { path: 'about', component: About },
  { path: 'blog', component: Blog },
  { path: 'shop', component: Shop },
  { path: 'product/:id', component: Product },
  { path: 'blog/:id', component: BlogPage },
{ path: 'user-reset-password/:token', component: ResetPosswordUser },

    { path: 'order-list', component: OrderlistUser, canActivate: [authGuard] },
  { path: 'cart', component: Addtocart, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'admin-login', component: AdminLogin},
  { path: 'admin-dash', component: Dashboard,canActivate:[adminAuthGuard]},
  { path: 'shop-manage', component: ShopManagement,canActivate:[adminAuthGuard]},
  { path: 'blog-manage', component: BlogManagement,canActivate:[adminAuthGuard]},
  { path: 'admin-create', component: ManageUser,canActivate:[adminAuthGuard]},
  { path: 'address', component: Address},
  {path: 'order-manage',component: AdminOrderComponent,canActivate:[adminAuthGuard]},
    { path: 'reset-password/:token', component: ResetPasswordComponent },

];
