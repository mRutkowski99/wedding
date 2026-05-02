import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        loadComponent: () => import('../pages/main.page'),
      },
      {
        path: 'gallery',
        loadComponent: () => import('../pages/gallery.page'),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
  ],
};
