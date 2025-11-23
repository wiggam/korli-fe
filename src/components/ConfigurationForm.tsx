import type { FormEvent } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeButtonClasses } from '../utils/theme';
import { Dropdown } from './Dropdown';
import { LevelSlider } from './LevelSlider';
import type { ChatConfig, StudentLevel } from '../types/chat';

interface ConfigurationFormProps {
	config: ChatConfig;
	languages: string[];
	levels: StudentLevel[];
	onChange: (field: keyof ChatConfig) => (value: string) => void;
	onSubmit: (event: FormEvent) => void;
	onReset?: () => void;
	hasSession: boolean;
	isStarting: boolean;
}

export const ConfigurationForm = ({
	config,
	languages,
	levels,
	onChange,
	onSubmit,
	onReset,
	hasSession,
	isStarting,
}: ConfigurationFormProps) => {
	const { theme } = useTheme();
	const themeButtonClasses = getThemeButtonClasses(theme.color, isStarting);

	// Get theme-specific glow classes for Start Chat button
	const getGlowClasses = () => {
		const colorMap: Record<string, string> = {
			yellow: 'ring-yellow-400/20 shadow-yellow-400/10',
			green: 'ring-green-400/20 shadow-green-400/10',
			blue: 'ring-blue-400/20 shadow-blue-400/10',
			pink: 'ring-pink-400/20 shadow-pink-400/10',
			purple: 'ring-purple-400/20 shadow-purple-400/10',
			orange: 'ring-orange-400/20 shadow-orange-400/10',
		};
		return colorMap[theme.color] || 'ring-blue-400/20 shadow-blue-400/10';
	};

	if (hasSession) {
		// Text display mode - show current config as text with restart button
		return (
			<div
				className={`border-b ${darkModeColors.border} px-2.5 sm:px-3 py-1.5 sm:py-2.5`}
			>
				<div className="flex items-center justify-between">
					<div
						className={`flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs ${darkModeColors.textMuted}`}
					>
						<span>
							<span className={`font-medium ${darkModeColors.textPrimary}`}>
								{config.foreignLanguage}
							</span>{' '}
							→ {config.nativeLanguage}
						</span>
						<span className={darkModeColors.textPlaceholder}>•</span>
						<span>
							Level:{' '}
							<span className={`font-medium ${darkModeColors.textPrimary}`}>
								{config.studentLevel}
							</span>
						</span>
					</div>

					<button
						type="button"
						onClick={onReset}
						className={`h-6 sm:h-8 rounded-full ${darkModeColors.button} px-2.5 sm:px-4 text-[9px] sm:text-xs font-semibold transition ${darkModeColors.buttonHover}`}
					>
						Reset
					</button>
				</div>
			</div>
		);
	}

	// Centered mode - prominent layout in empty chat
	return (
		<div className="flex min-h-[520px] items-center justify-center p-6">
			<form onSubmit={onSubmit} className="w-full max-w-3xl space-y-5">
				<div className="text-center">
					<h2 className={`text-xl font-semibold ${darkModeColors.textPrimary}`}>
						Start your language practice
					</h2>
				</div>

				<div className="space-y-5">
					{/* Language Dropdowns */}
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-3">
							<label
								className={`text-sm sm:text-base font-medium ${darkModeColors.textSecondary}`}
							>
								Foreign Language
							</label>
							<Dropdown
								value={config.foreignLanguage}
								options={languages}
								onChange={onChange('foreignLanguage')}
								searchable={true}
								themeColor={theme.color}
							/>
						</div>

						<div className="flex flex-col gap-3">
							<label
								className={`text-sm sm:text-base font-medium ${darkModeColors.textSecondary}`}
							>
								Native Language
							</label>
							<Dropdown
								value={config.nativeLanguage}
								options={languages}
								onChange={onChange('nativeLanguage')}
								searchable={true}
								themeColor={theme.color}
							/>
						</div>
					</div>

					{/* Level Slider */}
					<div className="flex flex-col gap-3 pt-4">
						<label
							className={`text-sm sm:text-base font-medium ${darkModeColors.textSecondary}`}
						>
							Level
						</label>
						<LevelSlider
							value={config.studentLevel}
							onChange={onChange('studentLevel')}
							levels={levels}
						/>
					</div>
				</div>

				<div className="flex justify-center pt-2">
					<button
						type="submit"
						disabled={isStarting}
						className={`h-10 rounded-full px-10 text-sm font-semibold transition ${themeButtonClasses} ring-8 shadow-2xl ${getGlowClasses()}`}
					>
						{isStarting ? 'Starting…' : 'Start Chat'}
					</button>
				</div>
			</form>
		</div>
	);
};
