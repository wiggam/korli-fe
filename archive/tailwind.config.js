/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// App-specific colors
				'korli-dark': '#0c0c0f',
				'korli-muted': '#10131a',
				'korli-ai': '#f2f5ff',
				'korli-user': '#dfeeff',
				'korli-border': '#dce1f0',
				'slate-850': '#1f242b', // soft mid-dark gray, not harsh

				// Custom mid-gray for dark surfaces
				// Enables utilities like bg-neutral-850, border-neutral-850, etc.
				'neutral-850': '#171717',
			},
		},
	},
	plugins: [],
};

/**
 * DARK MODE COLOR REFERENCE
 *
 * Central dark mode palette used in src/utils/theme.ts
 *
 * - Background: neutral-900 (#0a0a0a-ish)
 * - Surface/Cards: neutral-850 (#171717)
 * - Borders: neutral-700 (#404040)
 * - Text: neutral-100 (#f5f5f5)
 * - Muted Text: neutral-300/400 (#d4d4d4 / #a3a3a3)
 */
