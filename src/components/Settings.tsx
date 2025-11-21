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
		className="h-5 w-5"
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
				className="fixed inset-0 z-40 bg-black/30"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className={`w-full max-w-[240px] sm:max-w-[280px] rounded-xl ${darkModeColors.border} ${darkModeColors.bgModal} shadow-xl`}>
					{/* Header */}
					<div className={`flex items-center justify-between border-b ${darkModeColors.border} px-2.5 sm:px-3 py-1.5 sm:py-2`}>
						<h2 className={`text-xs sm:text-sm font-semibold ${darkModeColors.textPrimary}`}>Settings</h2>
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
					<div className="space-y-2.5 sm:space-y-3 px-2.5 sm:px-3 py-2.5 sm:py-3">
						{/* Dark Mode Toggle */}
						<div className="space-y-1.5">
							<label className={`block text-[9px] sm:text-[10px] font-medium ${darkModeColors.textSecondary}`}>Theme Mode</label>
							<TwoOptionSlider
								leftOption="light"
								rightOption="dark"
								value={theme.mode}
								onChange={handleModeChange}
								leftLabel="Light"
								rightLabel="Dark"
								size="sm"
							/>
						</div>

						{/* Theme Color Selector */}
						<div className="space-y-1.5">
							<label className={`text-[9px] sm:text-[10px] font-medium ${darkModeColors.textSecondary}`}>Theme Color</label>
							<div className="flex items-center gap-1.5">
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
											className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border transition ${
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
					<div className={`flex gap-1.5 border-t ${darkModeColors.border} px-2.5 sm:px-3 py-1.5 sm:py-2`}>
					<button
						type="button"
						onClick={onClose}
						className={`flex-1 rounded-full border ${darkModeColors.borderMuted} ${darkModeColors.bgSurface} ${darkModeColors.textSecondary} px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold transition ${darkModeColors.bgHoverLight}`}
					>
						Close
					</button>
					</div>
				</div>
			</div>
		</>
	);
};

