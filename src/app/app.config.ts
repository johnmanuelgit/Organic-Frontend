import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { loaderInterceptor } from './interceptor/loader/loader-interceptor';
import { httpInterceptor } from './interceptor/http/http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAnimations(),
    provideToastr(),          

    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        httpInterceptor
      ])
    )
  ]
};
