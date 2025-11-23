import type { FormEvent } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeButtonClasses } from '../utils/theme';
import { Dropdown } from './Dropdown';
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

	// Helper function to add labels to level options for display
	const getLevelDisplayText = (level: string) => {
		switch (level) {
			case 'A1':
				return 'A1 (Beginner)';
			case 'B1':
				return 'B1 (Intermediate)';
			case 'C1':
				return 'C1 (Advanced)';
			default:
				return level;
		}
	};

	if (hasSession) {
		// Text display mode - show current config as text with restart button
		return (
			<div className={`border-b ${darkModeColors.border} px-2.5 sm:px-3 py-1.5 sm:py-2.5`}>
				<div className="flex items-center justify-between">
					<div className={`flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs ${darkModeColors.textMuted}`}>
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

				<div className="space-y-3">
					{/* Row: Foreign, Native, Level */}
					<div className="grid gap-3 sm:grid-cols-3">
						<div className="flex flex-col gap-1.5">
							<label className={`text-xs font-medium ${darkModeColors.textSecondary}`}>
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

						<div className="flex flex-col gap-1.5">
							<label className={`text-xs font-medium ${darkModeColors.textSecondary}`}>
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

						<div className="flex flex-col gap-1.5">
							<label className={`text-xs font-medium ${darkModeColors.textSecondary}`}>
								Level
							</label>
							<Dropdown
								value={config.studentLevel}
								options={levels}
								onChange={onChange('studentLevel')}
								searchable={false}
								getDisplayText={getLevelDisplayText}
								themeColor={theme.color}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-center pt-2">
					<button
						type="submit"
						disabled={isStarting}
						className={`h-10 rounded-full px-10 text-sm font-semibold transition ${themeButtonClasses}`}
					>
						{isStarting ? 'Starting…' : 'Start Chat'}
					</button>
				</div>
			</form>
		</div>
	);
};
