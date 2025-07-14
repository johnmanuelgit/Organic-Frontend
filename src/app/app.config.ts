import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { loaderInterceptor } from './interceptor/loader/loader-interceptor';
import { httpInterceptor } from './interceptor/http/http-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Add this


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideToastr(),
  provideHttpClient(
    withInterceptors([loaderInterceptor])
  ),
  
  provideHttpClient(
    withInterceptors([httpInterceptor])
  ),
  provideAnimations(),


  ]
};
