import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { providePrimeNG } from "primeng/config";

import { CustomThemePreset } from "./theme.config";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: CustomThemePreset,
        options: {
          // Prevent dark mode to be synced from OS settings by default
          // TODO 2025-07-21 Blockost Remove this when dark mode is fully supported
          darkModeSelector: false || "none",
        },
      },
    }),
    provideHttpClient(),
  ],
};
