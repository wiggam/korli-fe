export type ThemeColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'orange';
export type ThemeMode = 'light' | 'dark';

export interface Theme {
	color: ThemeColor;
	mode: ThemeMode;
}

export const THEME_COLORS: ThemeColor[] = ['yellow', 'green', 'blue', 'pink', 'purple', 'orange'];

export const THEME_MODES: ThemeMode[] = ['light', 'dark'];

