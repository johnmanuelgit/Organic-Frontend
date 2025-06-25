import { Routes } from '@angular/router';
import { authGuard } from './authguard/auth/auth-guard';
import { Home } from './home/home';
import { Product } from './product/product';
import { Contact } from './contact/contact';
import { Cart } from './cart/cart';
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

export const routes: Routes = [
  { path: "", component: Home },
  { path: "home", component: Home, canActivate: [authGuard] },
  { path: "products", component: Product, canActivate: [authGuard] },
  { path: "contact", component: Contact, canActivate: [authGuard] },
  { path: "cart", component:Cart, canActivate: [authGuard] },
  { path: "login", component: Login },
  { path: "signup", component: Signup },
  { path: "about", component: About, canActivate: [authGuard] },
  { path: "blog", component: Blog, canActivate: [authGuard] },
  { path: "profile", component: Profile, canActivate: [authGuard] },
  { path: "term&cond", component: Terms, canActivate: [authGuard] },
  { path: "return&refund", component: ReturnRefund, canActivate: [authGuard] },
  { path: "privacy", component: Privacy, canActivate: [authGuard] },
  { path: "wiki", component: Wiki, canActivate: [authGuard] },
  { path: "recipes", component: Recipes, canActivate: [authGuard] },
  
  // product details page
//   { path: "devgad", component: DevgadComponent, canActivate: [authGuard] },
//   { path: "goa", component: GoaMankuradComponent, canActivate: [authGuard] },
//   { path: "kesar", component: KesarMangoComponent, canActivate: [authGuard] },
//   { path: "langra", component: LangraMangoComponent, canActivate: [authGuard] },
//   { path: "ratnagiri", component: RatnagiriAlphonsoComponent, canActivate: [authGuard] },
//   { path: "payari", component: PayariMangoesComponent, canActivate: [authGuard] },
//   { path: "ratna", component: RatnaAlphonsoComponent, canActivate: [authGuard] },

  // blog page
  { path: "blog/:id", component: BlogPage, canActivate: [authGuard] },

  { path: "admin-login", component: AdminLogin },
  { path: "admin-dash", component: Dashboard },
  { path: "shop-manage", component: ShopManagement}
];
