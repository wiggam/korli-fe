import type { ThemeColor } from '../types/theme';

export interface ThemeColorClasses {
	primary: string;
	hover: string;
	lightBg: string;
	darkText: string;
	border: string;
	ring: string;
	darkPrimary: string; // For dark mode backgrounds
}

/**
 * Dark mode color utilities - centralized color classes
 * Dark mode uses medium-light grey palette (slate-400 to slate-600 range)
 * for a cohesive, readable appearance that's not too dark or too light.
 */
export const darkModeColors = {
	// Body background
	bgBody: 'bg-slate-50 dark:bg-slate-500',

	// Card / surface backgrounds
	bgSurface: 'bg-white dark:bg-[#8795A6]',
	bgCard: 'bg-white dark:bg-[#8795A6]',
	bgModal: 'bg-white dark:bg-[#8795A6]',

	// Chat area specific
	bgChatArea: 'bg-white dark:bg-[#8795A6]',
	bgChatScroll: 'bg-white dark:bg-[#8795A6]',

	// Hover backgrounds for subtle emphasis
	bgHover: 'hover:bg-slate-100 dark:hover:bg-slate-500',
	bgHoverLight: 'hover:bg-slate-50 dark:hover:bg-slate-500',

	// Borders
	border: 'border-slate-200 dark:border-slate-500',
	borderMuted: 'border-slate-300 dark:border-slate-500',
	borderStrong: 'border-slate-400 dark:border-slate-600',

	// Text - light text for dark mode to contrast with slate-500/400 backgrounds
	text: 'text-slate-900 dark:text-white',
	textPrimary: 'text-slate-900 dark:text-white',
	textSecondary: 'text-slate-700 dark:text-slate-100',
	textMuted: 'text-slate-600 dark:text-slate-200',
	textPlaceholder: 'text-slate-400 dark:text-slate-100',
	// Chat hints - light text to stand out in dark mode
	chatHint: 'text-slate-600 dark:text-white',

	// Buttons / interactive surfaces
	button: 'bg-slate-100 dark:bg-slate-500 text-slate-800 dark:text-white',
	buttonHover: 'hover:bg-slate-200 dark:hover:bg-slate-600',
	buttonSecondary:
		'bg-slate-50 dark:bg-slate-500 text-slate-800 dark:text-white',
	buttonSecondaryHover: 'hover:bg-slate-100 dark:hover:bg-slate-600',

	// Input fields
	inputBg: 'bg-white dark:bg-[#A1ACBA]',
	inputBorder: 'border-slate-200 dark:border-slate-500',
	inputText: 'text-slate-900 dark:text-white',
	inputPlaceholder:
		'placeholder:text-slate-400 dark:placeholder:text-[#F0F2F4]',
	// Input bar icon buttons (person, mic icons)
	inputIconBg: 'bg-white dark:bg-[#A1ACBA]',
	inputIconBorder: 'border-transparent dark:border-transparent',
	inputIconText: 'text-slate-700 dark:text-white',
	inputIconHover: 'hover:bg-gray-100 dark:hover:bg-slate-400',

	// Navigation tabs
	tabBg: 'bg-slate-100 dark:bg-slate-500',
	tabText: 'text-slate-700 dark:text-slate-200',
	tabTextActive: 'text-white dark:text-white',
	tabHover: 'hover:text-slate-900 dark:hover:text-white',

	// Message bubbles
	messageAiBg: 'bg-white dark:bg-[#8795A6]',
	messageAiText: 'text-slate-900 dark:text-white',
	messageUserPill: 'dark:bg-slate-500', // Will be combined with theme color
	messageUserText: 'dark:text-white',
	// AI message icon buttons - borders should match chat background
	messageAiIconBg: 'bg-white dark:bg-[#8795A6]',
	messageAiIconBorder: 'border-transparent dark:border-transparent',
	messageAiIconText: 'text-slate-700 dark:text-white',
	// AI message audio player buttons
	messageAiAudioBg: 'bg-white dark:bg-[#8795A6]',
	messageAiAudioBorder: 'border-transparent dark:border-transparent',
	messageAiAudioText: 'text-slate-700 dark:text-white',
	messageAiAudioHover: 'hover:bg-gray-100 dark:hover:bg-slate-500',

	// Icon buttons
	iconButton: 'bg-white dark:bg-slate-500 text-slate-700 dark:text-white',
	iconButtonHover: 'hover:bg-gray-100 dark:hover:bg-slate-600',

	// Dropdown
	dropdownBg: 'bg-white dark:bg-slate-400',
	dropdownBorder: 'border-slate-200 dark:border-slate-500',
	dropdownOptionHover: 'bg-slate-100 dark:bg-slate-500',
	dropdownOptionSelected: 'bg-blue-50 dark:bg-blue-900/30',

	// Special sections (translation, correction boxes)
	sectionBg: 'bg-slate-50 dark:bg-slate-500',
	sectionBorder: 'border-slate-200 dark:border-slate-600',
} as const;

export const getThemeColorClasses = (color: ThemeColor): ThemeColorClasses => {
	const colorMap: Record<ThemeColor, ThemeColorClasses> = {
		yellow: {
			primary: 'bg-yellow-500',
			hover: 'hover:bg-yellow-400',
			lightBg: 'bg-yellow-100',
			darkText: 'text-yellow-900',
			border: 'border-yellow-500',
			ring: 'ring-yellow-400',
			darkPrimary: 'dark:bg-yellow-500',
		},
		green: {
			primary: 'bg-green-500',
			hover: 'hover:bg-green-400',
			lightBg: 'bg-green-100',
			darkText: 'text-green-900',
			border: 'border-green-500',
			ring: 'ring-green-400',
			darkPrimary: 'dark:bg-green-500',
		},
		blue: {
			primary: 'bg-blue-500',
			hover: 'hover:bg-blue-400',
			lightBg: 'bg-blue-100',
			darkText: 'text-blue-900',
			border: 'border-blue-500',
			ring: 'ring-blue-400',
			darkPrimary: 'dark:bg-blue-500',
		},
		pink: {
			primary: 'bg-pink-500',
			hover: 'hover:bg-pink-400',
			lightBg: 'bg-pink-100',
			darkText: 'text-pink-900',
			border: 'border-pink-500',
			ring: 'ring-pink-400',
			darkPrimary: 'dark:bg-pink-500',
		},
		purple: {
			primary: 'bg-purple-500',
			hover: 'hover:bg-purple-400',
			lightBg: 'bg-purple-100',
			darkText: 'text-purple-900',
			border: 'border-purple-500',
			ring: 'ring-purple-400',
			darkPrimary: 'dark:bg-purple-500',
		},
		orange: {
			primary: 'bg-orange-500',
			hover: 'hover:bg-orange-400',
			lightBg: 'bg-orange-100',
			darkText: 'text-orange-900',
			border: 'border-orange-500',
			ring: 'ring-orange-400',
			darkPrimary: 'dark:bg-orange-500',
		},
	};

	return colorMap[color];
};

export const getThemeButtonClasses = (
	color: ThemeColor,
	disabled = false
): string => {
	const classes = getThemeColorClasses(color);
	const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';
	return `${classes.primary} ${classes.hover} text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${disabledClasses}`;
};

export const getThemeBorderButtonClasses = (
	color: ThemeColor,
	isActive = false
): string => {
	const classes = getThemeColorClasses(color);

	if (isActive) {
		// Solid colored button
		return `${classes.border} ${classes.primary} text-white`;
	}

	// Outline / secondary button that works in both modes
	return [
		darkModeColors.borderMuted,
		darkModeColors.bgSurface,
		darkModeColors.textSecondary,
		darkModeColors.bgHover,
		'hover:border-slate-400',
		'dark:hover:border-slate-600',
	].join(' ');
};

/**
 * Get classes for user message pills that work in both light and dark mode
 * Uses theme color in both light and dark mode
 */
export const getUserMessagePillClasses = (color: ThemeColor): string => {
	const classes = getThemeColorClasses(color);
	return `${classes.lightBg} ${classes.darkPrimary} ${classes.darkText} ${darkModeColors.messageUserText} shadow-sm`;
};
