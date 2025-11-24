import { useEffect, useRef, useState } from 'react';

import { darkModeColors, getThemeColorClasses } from '../utils/theme';
import type { ThemeColor } from '../types/theme';

interface DropdownProps {
	value: string;
	options: readonly string[] | string[];
	onChange: (value: string) => void;
	searchable?: boolean;
	placeholder?: string;
	className?: string;
	capitalize?: boolean;
	getDisplayText?: (option: string) => string;
	themeColor?: ThemeColor;
	getFlagPath?: (option: string) => string | null;
}

export const Dropdown = ({
	value,
	options,
	onChange,
	searchable = false,
	placeholder = 'Select...',
	className = '',
	capitalize = false,
	getDisplayText,
	themeColor,
	getFlagPath,
}: DropdownProps) => {
	const getDisplay = (option: string) => {
		return getDisplayText ? getDisplayText(option) : option;
	};

	const themeClasses = themeColor ? getThemeColorClasses(themeColor) : null;

	// Get focus border and ring classes based on theme color, fallback to blue
	const getFocusClasses = () => {
		if (themeClasses) {
			return `focus:${themeClasses.border} focus:outline-none focus:ring-2 focus:${themeClasses.ring}/30`;
		}
		return 'focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30';
	};

	// Get selected option text color based on theme color, fallback to blue
	const getSelectedTextClasses = () => {
		if (themeColor) {
			const colorMap: Record<ThemeColor, string> = {
				yellow: 'text-yellow-600 dark:text-yellow-400',
				green: 'text-green-600 dark:text-green-400',
				blue: 'text-blue-600 dark:text-blue-400',
				pink: 'text-pink-600 dark:text-pink-400',
				purple: 'text-purple-600 dark:text-purple-400',
				orange: 'text-orange-600 dark:text-orange-400',
			};
			return colorMap[themeColor];
		}
		return 'text-blue-600 dark:text-blue-400';
	};

	// Get selected option background color based on theme color, fallback to blue
	const getSelectedBgClasses = () => {
		if (themeColor) {
			const colorMap: Record<ThemeColor, string> = {
				yellow: 'bg-yellow-50 dark:bg-yellow-900/30',
				green: 'bg-green-50 dark:bg-green-900/30',
				blue: 'bg-blue-50 dark:bg-blue-900/30',
				pink: 'bg-pink-50 dark:bg-pink-900/30',
				purple: 'bg-purple-50 dark:bg-purple-900/30',
				orange: 'bg-orange-50 dark:bg-orange-900/30',
			};
			return colorMap[themeColor];
		}
		return darkModeColors.dropdownOptionSelected; // Fallback to blue
	};
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Filter options based on search term
	const filteredOptions =
		searchable && searchTerm
			? options.filter((option) =>
					option.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: options;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSearchTerm('');
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && searchable && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isOpen, searchable]);

	// Reset search and highlighted index when closing
	useEffect(() => {
		if (!isOpen) {
			setSearchTerm('');
			setHighlightedIndex(-1);
		}
	}, [isOpen]);

	const handleSelect = (option: string) => {
		onChange(option);
		setIsOpen(false);
		setSearchTerm('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
				e.preventDefault();
				setIsOpen(true);
			}
			return;
		}

		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				setIsOpen(false);
				break;
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev < filteredOptions.length - 1 ? prev + 1 : prev
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
				break;
			case 'Enter':
				e.preventDefault();
				if (
					highlightedIndex >= 0 &&
					highlightedIndex < filteredOptions.length
				) {
					handleSelect(filteredOptions[highlightedIndex]);
				}
				break;
		}
	};

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			{/* Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				className={`h-9 w-full rounded-full border border-slate-200 dark:border-0 ${
					darkModeColors.dropdownBg
				} px-3.5 text-left text-xs ${
					darkModeColors.inputText
				} ${getFocusClasses()} ${capitalize ? 'capitalize' : ''}`}
			>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0 flex-1">
						{value && getFlagPath && getFlagPath(value) && (
							<img
								src={getFlagPath(value)!}
								alt={`${value} flag`}
								className="h-4 w-6 flex-shrink-0 object-cover"
							/>
						)}
						<span className={`truncate ${capitalize ? 'capitalize' : ''}`}>
							{value ? getDisplay(value) : placeholder}
						</span>
					</div>
					<svg
						className={`h-3.5 w-3.5 flex-shrink-0 ${
							darkModeColors.textPlaceholder
						} transition-transform ${isOpen ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div
					className={`absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 dark:border-white ${darkModeColors.dropdownBg} shadow-lg`}
				>
					{/* Search Input */}
					{searchable && (
						<div className={`border-b border-slate-200 dark:border-white p-2`}>
							<input
								ref={searchInputRef}
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setHighlightedIndex(0);
								}}
								onKeyDown={handleKeyDown}
								placeholder="Search..."
								className={`h-8 w-full rounded-lg border-slate-200 dark:border-white ${
									darkModeColors.dropdownBg
								} px-2.5 text-xs ${darkModeColors.inputText} ${
									darkModeColors.inputPlaceholder
								} ${getFocusClasses()}`}
							/>
						</div>
					)}

					{/* Options List */}
					<div className="max-h-[300px] overflow-y-auto p-1">
						{filteredOptions.length > 0 ? (
							filteredOptions.map((option, index) => (
								<button
									key={option}
									type="button"
									onClick={() => handleSelect(option)}
									onMouseEnter={() => setHighlightedIndex(index)}
									className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition flex items-center gap-2 ${
										capitalize ? 'capitalize' : ''
									} ${
										option === value
											? `${getSelectedBgClasses()} font-medium ${getSelectedTextClasses()}`
											: highlightedIndex === index
											? `${darkModeColors.dropdownOptionHover} ${darkModeColors.textPrimary}`
											: `${darkModeColors.textSecondary}`
									}`}
								>
									{getFlagPath && getFlagPath(option) && (
										<img
											src={getFlagPath(option)!}
											alt={`${option} flag`}
											className="h-4 w-6 flex-shrink-0 object-cover"
										/>
									)}
									<span>{getDisplay(option)}</span>
								</button>
							))
						) : (
							<div
								className={`px-2.5 py-4 text-center text-xs ${darkModeColors.textMuted}`}
							>
								No results found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
