import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { Loader } from '../../services/loader/loader';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loaderService = inject(Loader);

  loaderService.show();

  return next(req).pipe(
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
