import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_COLORS, type ThemeColor, type ThemeMode } from '../types/theme';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';
import { TwoOptionSlider } from './TwoOptionSlider';

interface SettingsProps {
	onClose: () => void;
}

const CloseIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-[26px] w-[26px] sm:h-5 sm:w-5"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M6 18L18 6M6 6l12 12" />
	</svg>
);

export const Settings = ({ onClose }: SettingsProps) => {
	const { theme, setColor, setMode } = useTheme();

	const handleColorChange = (color: ThemeColor) => {
		setColor(color);
	};

	const handleModeChange = (mode: ThemeMode) => {
		setMode(mode);
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-[60] bg-black/30"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
				<div
					className={`w-full max-w-[312px] sm:max-w-[280px] md:max-w-[400px] rounded-xl ${
						getThemeColorClasses(theme.color).border
					} ${darkModeColors.bgModal} shadow-xl pointer-events-auto`}
				>
					{/* Header */}
					<div
						className={`flex items-center justify-between border-b ${darkModeColors.borderChatSeparator} px-3.5 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3`}
					>
						<h2
							className={`text-sm sm:text-sm md:text-base font-semibold ${darkModeColors.textPrimary}`}
						>
							Settings
						</h2>
						<button
							type="button"
							onClick={onClose}
							className={`rounded-full p-0.5 ${darkModeColors.textPlaceholder} transition ${darkModeColors.bgHover} hover:text-slate-600 dark:hover:text-white`}
							aria-label="Close"
						>
							<CloseIcon />
						</button>
					</div>

					{/* Content */}
					<div className="space-y-2.5 sm:space-y-3 md:space-y-4 px-3.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4">
						{/* Dark Mode Toggle */}
						<div className="space-y-1.5 md:space-y-2">
							<label
								className={`block text-[11.7px] sm:text-[10px] md:text-sm font-medium ${darkModeColors.textSecondary}`}
							>
								Theme Mode
							</label>
							<TwoOptionSlider
								leftOption="light"
								rightOption="dark"
								value={theme.mode}
								onChange={handleModeChange}
								leftLabel="Light"
								rightLabel="Dark"
								leftIcon={<Sun className="h-4 w-4 md:h-5 md:w-5" />}
								rightIcon={<Moon className="h-4 w-4 md:h-5 md:w-5" />}
								size="sm"
							/>
						</div>

						{/* Theme Color Selector */}
						<div className="space-y-1.5 md:space-y-2">
							<label
								className={`text-[11.7px] sm:text-[10px] md:text-sm font-medium ${darkModeColors.textSecondary}`}
							>
								Theme Color
							</label>
							<div className="flex items-center gap-1.5 md:gap-2">
								{THEME_COLORS.map((color) => {
									const colorClasses = getThemeColorClasses(color);
									const colorMap: Record<ThemeColor, string> = {
										yellow: 'bg-yellow-500',
										green: 'bg-green-500',
										blue: 'bg-blue-500',
										pink: 'bg-pink-500',
										purple: 'bg-purple-500',
										orange: 'bg-orange-500',
									};
									return (
										<button
											key={color}
											type="button"
											onClick={() => handleColorChange(color)}
											className={`h-[26px] w-[26px] sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full border transition ${
												theme.color === color
													? `${colorClasses.border} ring-2 ${colorClasses.ring} ring-offset-1`
													: `${darkModeColors.borderMuted} hover:border-slate-400 dark:hover:border-slate-500`
											} ${colorMap[color]}`}
											aria-label={`Select ${color} theme`}
										/>
									);
								})}
							</div>
						</div>
					</div>

					{/* Footer */}
					<div
						className={`flex gap-1.5 md:gap-2 border-t ${darkModeColors.borderChatSeparator} px-3.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3`}
					>
						<button
							type="button"
							onClick={onClose}
							className={`flex-1 rounded-full border ${darkModeColors.borderChatSeparator} ${darkModeColors.bgSurface} ${darkModeColors.textSecondary} px-3.5 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 text-[11.7px] sm:text-[10px] md:text-sm font-semibold transition ${darkModeColors.bgHoverLight}`}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
