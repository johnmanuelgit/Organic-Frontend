import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Toastr } from '../../services/toast/toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(Toastr);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    toast.error('Please login or register to Continue');
    router.navigate(['/login']);
    return false;
  }
};
