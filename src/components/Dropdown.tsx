import { useEffect, useRef, useState } from 'react';

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
				className={`h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-left text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 ${
					capitalize ? 'capitalize' : ''
				}`}
			>
				<div className="flex items-center justify-between">
					<span className={capitalize ? 'capitalize' : ''}>{value || placeholder}</span>
					<svg
						className={`h-4 w-4 text-slate-400 transition-transform ${
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
				<div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white shadow-lg">
					{/* Search Input */}
					{searchable && (
						<div className="border-b border-slate-200 p-2">
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
								className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
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
									className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
										capitalize ? 'capitalize' : ''
									} ${
										option === value
											? 'bg-blue-50 font-medium text-blue-600'
											: highlightedIndex === index
											? 'bg-slate-100 text-slate-900'
											: 'text-slate-700 hover:bg-slate-50'
									}`}
								>
									{option}
								</button>
							))
						) : (
							<div className="px-3 py-6 text-center text-sm text-slate-500">
								No results found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

