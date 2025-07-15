import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loader } from '../../services/loader/loader';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loaderService = inject(Loader); 
  const token = localStorage.getItem('token');

  const clonedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  loaderService.show();

  return next(clonedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
      },
    }),
    finalize(() => {
      loaderService.hide();
    })
  );
};
