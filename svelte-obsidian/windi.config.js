import { defineConfig } from 'windicss/helpers';

const config = defineConfig({
  darkMode: 'class',
  extract: {
    include: ['src/**/*.{html,svelte,ts}'],
  },
});

console.log(config);

export default config;