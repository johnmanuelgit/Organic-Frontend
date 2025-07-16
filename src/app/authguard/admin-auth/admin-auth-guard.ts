import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Toastr } from '../../services/toast/toastr';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(Toastr);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user?.role) {
    toast.error('Please login or register to continue');
    router.navigate(['/home']);
    return false;
  }

  return true;
};
