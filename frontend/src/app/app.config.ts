import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from 'src/app/app.routes';
import { HttpInterceptorService } from 'src/app/core/interceptors/http-interceptor.service';
import { HttpInterceptorRecieverService } from 'src/app/core/interceptors/http-interceptor-reciever.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorRecieverService, multi: true }
  ]
};
