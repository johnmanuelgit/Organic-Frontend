import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { httpInterceptor } from './interceptor/http/http-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgToast } from 'ng-angular-popup';
import { authInterceptor } from './interceptor/auths/auth-interceptor';
import { loaderInterceptor } from './interceptor/loader/loader-interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgToast(),
    provideAnimations(),

provideHttpClient(
  withFetch(),
  withInterceptors([httpInterceptor, authInterceptor,loaderInterceptor])
),
  ],
};
