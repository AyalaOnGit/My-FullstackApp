import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // ייבוא ערכת הנושא Aura
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
          preset: Aura // כאן את קובעת את ערכת הנושא
      }
  })
  ]
};

