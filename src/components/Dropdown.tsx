import { useEffect, useRef, useState } from 'react';

import { darkModeColors } from '../utils/theme';

interface DropdownProps {
	value: string;
	options: readonly string[] | string[];
	onChange: (value: string) => void;
	searchable?: boolean;
	placeholder?: string;
	className?: string;
	capitalize?: boolean;
}

export const Dropdown = ({
	value,
	options,
	onChange,
	searchable = false,
	placeholder = 'Select...',
	className = '',
	capitalize = false,
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Filter options based on search term
	const filteredOptions = searchable && searchTerm
		? options.filter((option) =>
				option.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: options;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
				if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
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
				className={`h-9 w-full rounded-full border ${darkModeColors.dropdownBorder} ${darkModeColors.dropdownBg} px-3.5 text-left text-xs ${darkModeColors.inputText} focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 ${
					capitalize ? 'capitalize' : ''
				}`}
			>
				<div className="flex items-center justify-between">
					<span className={capitalize ? 'capitalize' : ''}>{value || placeholder}</span>
					<svg
						className={`h-3.5 w-3.5 ${darkModeColors.textPlaceholder} transition-transform ${
							isOpen ? 'rotate-180' : ''
						}`}
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
				<div className={`absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border ${darkModeColors.dropdownBorder} ${darkModeColors.dropdownBg} shadow-lg`}>
					{/* Search Input */}
					{searchable && (
						<div className={`border-b ${darkModeColors.border} p-2`}>
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
								className={`h-8 w-full rounded-lg ${darkModeColors.dropdownBorder} ${darkModeColors.dropdownBg} px-2.5 text-xs ${darkModeColors.inputText} ${darkModeColors.inputPlaceholder} focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30`}
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
									className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
										capitalize ? 'capitalize' : ''
									} ${
										option === value
											? `${darkModeColors.dropdownOptionSelected} font-medium text-blue-600 dark:text-blue-400`
											: highlightedIndex === index
											? `${darkModeColors.dropdownOptionHover} ${darkModeColors.textPrimary}`
											: `${darkModeColors.textSecondary}`
									}`}
								>
									{option}
								</button>
							))
						) : (
							<div className={`px-2.5 py-4 text-center text-xs ${darkModeColors.textMuted}`}>
								No results found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

