// unocss.config.ts
import { defineConfig, presetUno, presetTypography } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography({
      // You can customize the typography preset here
      // For example, to better match the Vite docs style
      cssExtend: {
        'a': {
          'color': '#646cff',
          'text-decoration': 'none',
        },
        'a:hover': {
          'color': '#535bf2',
        },
        'code': {
          'color': '#888',
          'background-color': '#2f2f2f',
          'padding': '0.2em 0.4em',
          'border-radius': '4px',
        },
        'pre': {
          'background': '#282c34 !important', // important to override default
        },
      },
    }),
  ],
});