import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Theme, ThemeColor, ThemeMode } from '../types/theme';

interface ThemeContextType {
	theme: Theme;
	setColor: (color: ThemeColor) => void;
	setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'korli-theme';
const DEFAULT_THEME: Theme = { color: 'blue', mode: 'light' };

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') {
			return DEFAULT_THEME;
		}
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsedTheme = JSON.parse(stored) as Theme;
				// Apply dark mode immediately on initial load
				if (parsedTheme.mode === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
				return parsedTheme;
			}
		} catch {
			// Ignore parse errors
		}
		// Ensure light mode is set on initial load
		document.documentElement.classList.remove('dark');
		return DEFAULT_THEME;
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
		} catch {
			// Ignore storage errors
		}

		// Apply dark mode class to document root
		if (theme.mode === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	const setColor = (color: ThemeColor) => {
		setTheme((prev) => ({ ...prev, color }));
	};

	const setMode = (mode: ThemeMode) => {
		setTheme((prev) => ({ ...prev, mode }));
	};

	return (
		<ThemeContext.Provider value={{ theme, setColor, setMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

