import { definePreset } from "@primeng/themes";
import Aura from "@primeng/themes/aura";

export const CustomThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
    colorScheme: {
      light: {
        root: {
          testMyVariable: "950px",
        },
      },
    },
  },
});
