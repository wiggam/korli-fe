import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';

interface TwoOptionSliderProps<T extends string> {
	leftOption: T;
	rightOption: T;
	value: T;
	onChange: (value: T) => void;
	leftLabel: string;
	rightLabel: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	size?: 'sm' | 'md';
	className?: string;
}

const sizeStyles = {
	sm: {
		buttonHeight: 'h-[31.2px] md:h-8',
		buttonPaddingX: 'px-3.5 md:px-3.5',
		buttonText: 'text-[13px] md:text-sm',
	},
	md: {
		buttonHeight: 'h-7 sm:h-8 md:h-10',
		buttonPaddingX: 'px-3 md:px-4',
		buttonText: 'text-[11px] sm:text-xs md:text-sm',
	},
} as const;

export const TwoOptionSlider = <T extends string>({
	leftOption,
	rightOption,
	value,
	onChange,
	leftLabel,
	rightLabel,
	leftIcon,
	rightIcon,
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
			className={`relative flex shrink-0 items-center rounded-full ${darkModeColors.sliderBg} p-[2px] ${className}`}
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
					aria-label={leftLabel}
					className={`relative z-10 flex items-center justify-center rounded-full ${
						styles.buttonHeight
					} ${leftIcon ? 'px-2' : styles.buttonPaddingX} ${
						!leftIcon ? styles.buttonText : ''
					} font-medium transition-colors duration-200 ${
						isLeft
							? darkModeColors.tabTextActive
							: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
					}`}
				>
					{leftIcon ? leftIcon : leftLabel}
				</button>

				<button
					type="button"
					onClick={() => handleClick(rightOption)}
					role="radio"
					aria-checked={!isLeft}
					aria-label={rightLabel}
					className={`relative z-10 flex items-center justify-center rounded-full ${
						styles.buttonHeight
					} ${rightIcon ? 'px-2' : styles.buttonPaddingX} ${
						!rightIcon ? styles.buttonText : ''
					} font-medium transition-colors duration-200 ${
						!isLeft
							? darkModeColors.tabTextActive
							: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
					}`}
				>
					{rightIcon ? rightIcon : rightLabel}
				</button>
			</div>
		</div>
	);
};
