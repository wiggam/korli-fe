import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';

interface TwoOptionSliderProps<T extends string> {
	leftOption: T;
	rightOption: T;
	value: T;
	onChange: (value: T) => void;
	leftLabel: string;
	rightLabel: string;
	size?: 'sm' | 'md';
	className?: string;
}

const sizeStyles = {
	sm: {
		buttonHeight: 'h-6',
		buttonPaddingX: 'px-2.5',
		buttonText: 'text-[10px]',
	},
	md: {
		buttonHeight: 'h-7 sm:h-8',
		buttonPaddingX: 'px-3',
		buttonText: 'text-[11px] sm:text-xs',
	},
} as const;

export const TwoOptionSlider = <T extends string>({
	leftOption,
	rightOption,
	value,
	onChange,
	leftLabel,
	rightLabel,
	size = 'md',
	className = '',
}: TwoOptionSliderProps<T>) => {
	const { theme } = useTheme();
	const themeClasses = getThemeColorClasses(theme.color);

	const isLeft = value === leftOption;
	const styles = sizeStyles[size];

	const handleClick = (option: T) => {
		if (option !== value) onChange(option);
	};

	return (
		<div
			className={`relative inline-flex shrink-0 items-center rounded-full ${darkModeColors.tabBg} p-[2px] ${className}`}
			role="radiogroup"
			aria-label="Mode selector"
		>
			{/* Sliding background */}
			<div
				className="pointer-events-none absolute inset-[2px] rounded-full overflow-hidden"
				aria-hidden="true"
			>
				<div
					className={`h-full w-1/2 rounded-full ${
						themeClasses.primary
					} transform-gpu transition-transform duration-300 ease-out ${
						isLeft ? 'translate-x-0' : 'translate-x-full'
					}`}
				/>
			</div>

			{/* Buttons */}
			<div className="relative grid w-full grid-cols-2">
				<button
					type="button"
					onClick={() => handleClick(leftOption)}
					role="radio"
					aria-checked={isLeft}
					className={`relative z-10 flex items-center justify-center rounded-full ${
						styles.buttonHeight
					} ${styles.buttonPaddingX} ${
						styles.buttonText
					} font-medium transition-colors duration-200 ${
						isLeft
							? darkModeColors.tabTextActive
							: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
					}`}
				>
					{leftLabel}
				</button>

				<button
					type="button"
					onClick={() => handleClick(rightOption)}
					role="radio"
					aria-checked={!isLeft}
					className={`relative z-10 flex items-center justify-center rounded-full ${
						styles.buttonHeight
					} ${styles.buttonPaddingX} ${
						styles.buttonText
					} font-medium transition-colors duration-200 ${
						!isLeft
							? darkModeColors.tabTextActive
							: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
					}`}
				>
					{rightLabel}
				</button>
			</div>
		</div>
	);
};
