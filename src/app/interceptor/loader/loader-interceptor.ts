import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loader } from '../../services/loader/loader';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader =inject(Loader)
  loader.show()
  return next(req).pipe(finalize(()=>loader.hide()))
};
