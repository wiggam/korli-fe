/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'korli-dark': '#0c0c0f',
				'korli-muted': '#10131a',
				'korli-ai': '#f2f5ff',
				'korli-user': '#dfeeff',
				'korli-border': '#dce1f0',
			},
		},
	},
	plugins: [],
};
