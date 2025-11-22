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
 * Centralized dark mode color constants
 * Change these values to quickly test different color schemes
 *
 * IMPORTANT: Use full Tailwind class names (e.g., 'dark:bg-slate-500') or hex values with brackets (e.g., 'dark:bg-[#8795A6]')
 * Tailwind's JIT compiler needs to see the complete class names at build time.
 */
const DARK_COLORS = {
	// Main backgrounds (use full class strings with dark: prefix)
	pageBackground: 'dark:bg-slate-500', // Page background
	chatBackground: 'dark:bg-[#8795A6]', // Main chat area, cards, modals, AI message backgrounds
	inputBackground: 'dark:bg-[#A1ACBA]', // Input fields and input icon buttons
	infoPageAlt: 'dark:bg-[#768A9D]', // Alternate background for info page sections

	// Text colors (use full class strings with dark: prefix)
	textPrimary: 'dark:text-white', // Primary text color
	textSecondary: 'dark:text-slate-100', // Secondary text color
	textMuted: 'dark:text-slate-200', // Muted text color
	textPlaceholder: 'dark:placeholder:text-[#F0F2F4]', // Placeholder text color

	// Background colors (use full class strings with dark: prefix)
	bgButton: 'dark:bg-[#8795A6]', // Button backgrounds
	bgSlider: 'dark:bg-[#697F96]', // Slider background (for TwoOptionSlider)
	bgHover: 'dark:hover:bg-slate-500', // Hover backgrounds
	bgHoverDark: 'dark:hover:bg-slate-600', // Darker hover backgrounds
	bgHoverStatic: 'dark:bg-slate-500', // Static hover background (for dropdowns)
	bgHoverAudio: 'dark:hover:bg-slate-500', // Audio player hover background
	bgSection: 'dark:bg-slate-500', // Section backgrounds
	bgDropdown: 'dark:bg-slate-400', // Dropdown background

	// Border colors (use full class strings with dark: prefix)
	borderDefault: 'dark:border-slate-500', // Default borders
	borderStrong: 'dark:border-slate-600', // Strong borders
	borderHover: 'dark:hover:bg-slate-400', // Hover background
} as const;

/**
 * Dark mode color utilities - centralized color classes
 * Dark mode uses medium-light grey palette (slate-400 to slate-600 range)
 * for a cohesive, readable appearance that's not too dark or too light.
 */
export const darkModeColors = {
	// Body background
	bgBody: `bg-slate-50 ${DARK_COLORS.bgButton}`,

	// Card / surface backgrounds
	bgSurface: `bg-white ${DARK_COLORS.chatBackground}`,
	bgCard: `bg-white ${DARK_COLORS.chatBackground}`,
	bgModal: `bg-white ${DARK_COLORS.chatBackground}`,

	// Chat area specific
	bgChatArea: `bg-white ${DARK_COLORS.chatBackground}`,
	bgChatScroll: `bg-white ${DARK_COLORS.chatBackground}`,

	// Hover backgrounds for subtle emphasis
	bgHover: `hover:bg-slate-100 ${DARK_COLORS.bgHover}`,
	bgHoverLight: `hover:bg-slate-50 ${DARK_COLORS.bgHover}`,

	// Borders
	border: `border-slate-200 ${DARK_COLORS.borderDefault}`,
	borderMuted: `border-slate-300 ${DARK_COLORS.borderDefault}`,
	borderStrong: `border-slate-400 ${DARK_COLORS.borderStrong}`,

	// Text - light text for dark mode to contrast with slate-500/400 backgrounds
	text: `text-slate-900 ${DARK_COLORS.textPrimary}`,
	textPrimary: `text-slate-900 ${DARK_COLORS.textPrimary}`,
	textSecondary: `text-slate-700 ${DARK_COLORS.textSecondary}`,
	textMuted: `text-slate-600 ${DARK_COLORS.textMuted}`,
	textPlaceholder: `text-slate-400 ${DARK_COLORS.textSecondary}`,
	// Chat hints - light text to stand out in dark mode
	chatHint: `text-slate-600 ${DARK_COLORS.textPrimary}`,

	// Buttons / interactive surfaces
	button: `bg-slate-100 ${DARK_COLORS.bgButton} text-slate-800 ${DARK_COLORS.textPrimary}`,
	buttonHover: `hover:bg-slate-200 ${DARK_COLORS.bgHoverDark}`,
	buttonSecondary: `bg-slate-50 ${DARK_COLORS.bgButton} text-slate-800 ${DARK_COLORS.textPrimary}`,
	buttonSecondaryHover: `hover:bg-slate-100 ${DARK_COLORS.bgHoverDark}`,

	// Input fields
	inputBg: `bg-white ${DARK_COLORS.inputBackground}`,
	inputBorder: `border-slate-200 ${DARK_COLORS.borderDefault}`,
	inputText: `text-slate-900 ${DARK_COLORS.textPrimary}`,
	inputPlaceholder: `placeholder:text-slate-400 ${DARK_COLORS.textPlaceholder}`,
	// Input bar icon buttons (person, mic icons)
	inputIconBg: `bg-white ${DARK_COLORS.inputBackground}`,
	inputIconBorder: 'border-transparent dark:border-transparent',
	inputIconText: `text-slate-700 ${DARK_COLORS.textPrimary}`,
	inputIconHover: `hover:bg-gray-100 ${DARK_COLORS.borderHover}`,

	// Navigation tabs
	tabBg: `bg-slate-100 ${DARK_COLORS.bgButton}`,
	tabText: `text-slate-700 ${DARK_COLORS.textMuted}`,
	tabTextActive: `text-white ${DARK_COLORS.textPrimary}`,
	tabHover: `hover:text-slate-900 ${DARK_COLORS.textPrimary}`,

	// Slider background (for TwoOptionSlider - separate from tabs to stand out on modals)
	sliderBg: `bg-slate-100 ${DARK_COLORS.bgSlider}`,

	// Message bubbles
	messageAiBg: `bg-white ${DARK_COLORS.chatBackground}`,
	messageAiText: `text-slate-900 ${DARK_COLORS.textPrimary}`,
	messageUserPill: DARK_COLORS.bgButton, // Will be combined with theme color
	messageUserText: DARK_COLORS.textPrimary,
	// AI message icon buttons - borders should match chat background
	messageAiIconBg: `bg-white ${DARK_COLORS.chatBackground}`,
	messageAiIconBorder: 'border-transparent dark:border-transparent',
	messageAiIconText: `text-slate-700 ${DARK_COLORS.textPrimary}`,
	// AI message audio player buttons
	messageAiAudioBg: `bg-white ${DARK_COLORS.chatBackground}`,
	messageAiAudioBorder: 'border-transparent dark:border-transparent',
	messageAiAudioText: `text-slate-700 ${DARK_COLORS.textPrimary}`,
	messageAiAudioHover: `hover:bg-gray-100 ${DARK_COLORS.bgHoverAudio}`,

	// Icon buttons
	iconButton: `bg-white ${DARK_COLORS.bgButton} text-slate-700 ${DARK_COLORS.textPrimary}`,
	iconButtonHover: `hover:bg-gray-100 ${DARK_COLORS.bgHoverDark}`,

	// Dropdown
	dropdownBg: `bg-white ${DARK_COLORS.bgDropdown}`,
	dropdownBorder: `border-slate-200 ${DARK_COLORS.borderDefault}`,
	dropdownOptionHover: `bg-slate-100 ${DARK_COLORS.bgHoverStatic}`,
	dropdownOptionSelected: 'bg-blue-50 dark:bg-blue-900/30',

	// Special sections (translation, correction boxes)
	sectionBg: `bg-slate-50 ${DARK_COLORS.bgSection}`,
	sectionBorder: `border-slate-200 ${DARK_COLORS.borderStrong}`,

	// Info page sections
	infoPageSection1: `bg-white ${DARK_COLORS.bgButton}`, // Primary section background (white in light, matches dark mode background)
	infoPageSection2: `bg-slate-50 ${DARK_COLORS.pageBackground}`, // Alternate section background (slate-50 in light, matches dark mode background)
} as const;

export const getThemeColorClasses = (color: ThemeColor): ThemeColorClasses => {
	const colorMap: Record<ThemeColor, ThemeColorClasses> = {
		yellow: {
			primary: 'bg-yellow-400',
			hover: 'hover:bg-yellow-300',
			lightBg: 'bg-yellow-50',
			darkText: 'text-yellow-900',
			border: 'border-yellow-400',
			ring: 'ring-yellow-300',
			darkPrimary: 'dark:bg-yellow-400',
		},
		green: {
			primary: 'bg-green-400',
			hover: 'hover:bg-green-300',
			lightBg: 'bg-green-50',
			darkText: 'text-green-900',
			border: 'border-green-400',
			ring: 'ring-green-300',
			darkPrimary: 'dark:bg-green-400',
		},
		blue: {
			primary: 'bg-blue-400',
			hover: 'hover:bg-blue-300',
			lightBg: 'bg-blue-50',
			darkText: 'text-blue-900',
			border: 'border-blue-400',
			ring: 'ring-blue-300',
			darkPrimary: 'dark:bg-blue-400',
		},
		pink: {
			primary: 'bg-pink-400',
			hover: 'hover:bg-pink-300',
			lightBg: 'bg-pink-50',
			darkText: 'text-pink-900',
			border: 'border-pink-400',
			ring: 'ring-pink-300',
			darkPrimary: 'dark:bg-pink-400',
		},
		purple: {
			primary: 'bg-purple-400',
			hover: 'hover:bg-purple-300',
			lightBg: 'bg-purple-50',
			darkText: 'text-purple-900',
			border: 'border-purple-400',
			ring: 'ring-purple-300',
			darkPrimary: 'dark:bg-purple-400',
		},
		orange: {
			primary: 'bg-orange-400',
			hover: 'hover:bg-orange-300',
			lightBg: 'bg-orange-50',
			darkText: 'text-orange-900',
			border: 'border-orange-400',
			ring: 'ring-orange-300',
			darkPrimary: 'dark:bg-orange-400',
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
