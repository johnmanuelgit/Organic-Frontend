import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AdminLogin } from './admin/admin-login/admin-login';
import { Dashboard } from './admin/dashboard/dashboard';
import { ShopManagement } from './admin/shop-management/shop-management';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'admin-login',component:AdminLogin},
    {path:'admin-dash',component:Dashboard},
    {path:'shopmanage',component:ShopManagement}
];
