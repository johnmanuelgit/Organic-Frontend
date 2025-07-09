import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { Loader } from '../../services/loader/loader';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loaderService: Loader) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let clonedReq = req;

    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    this.loaderService.show();

    return next.handle(clonedReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log(' HTTP Response:', event);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
        },
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}
