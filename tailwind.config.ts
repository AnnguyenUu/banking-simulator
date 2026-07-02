import type { Config } from 'tailwindcss';

// Ant Design ships its own unlayered CSS-in-JS styles. Tailwind's utilities are
// imported into a named `@layer` (see src/index.css) so they don't fight with
// Preflight — but per the CSS cascade-layers spec, ANY unlayered rule always beats
// a layered one regardless of specificity. That means antd's own styles silently
// override plain Tailwind utilities (margins, position, colors, widths, ...) on its
// components. Marking every utility `!important` here is what makes them actually win.
export default {
  important: true,
} satisfies Config;
