import { useState } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import {
	darkModeColors,
	getThemeButtonClasses,
	getThemeColorClasses,
} from '../utils/theme';
import type { GenderOption } from '../types/chat';
import { TwoOptionSlider } from './TwoOptionSlider';

interface GenderSettingsProps {
	tutorGender: GenderOption;
	studentGender: GenderOption;
	onApply: (tutorGender: GenderOption, studentGender: GenderOption) => void;
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


export const GenderSettings = ({
	tutorGender,
	studentGender,
	onApply,
	onClose,
}: GenderSettingsProps) => {
	const { theme } = useTheme();
	const [localTutorGender, setLocalTutorGender] =
		useState<GenderOption>(tutorGender);
	const [localStudentGender, setLocalStudentGender] =
		useState<GenderOption>(studentGender);

	const handleApply = () => {
		onApply(localTutorGender, localStudentGender);
		onClose();
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
					className={`w-full max-w-[240px] sm:max-w-[280px] md:max-w-[400px] rounded-xl ${getThemeColorClasses(theme.color).border} ${darkModeColors.bgModal} shadow-xl pointer-events-auto`}
				>
					{/* Header */}
					<div
						className={`flex items-center justify-between border-b ${darkModeColors.border} px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3`}
					>
						<h2
							className={`text-xs sm:text-sm md:text-base font-semibold ${darkModeColors.textPrimary}`}
						>
							Gender Settings
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
					<div className="space-y-2.5 sm:space-y-3 md:space-y-4 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4">
						{/* Tutor Gender */}
						<div className="space-y-1.5 md:space-y-2">
							<label
								className={`text-[9px] sm:text-[10px] md:text-sm font-medium ${darkModeColors.textSecondary}`}
							>
								Tutor Gender
							</label>
							<div className="w-full">
								<TwoOptionSlider
									leftOption="female"
									rightOption="male"
									value={localTutorGender}
									onChange={setLocalTutorGender}
									leftLabel="Female"
									rightLabel="Male"
									size="sm"
									className="w-full"
								/>
							</div>
						</div>

						{/* Student Gender */}
						<div className="space-y-1.5 md:space-y-2">
							<label
								className={`text-[9px] sm:text-[10px] md:text-sm font-medium ${darkModeColors.textSecondary}`}
							>
								Student Gender
							</label>
							<div className="w-full">
								<TwoOptionSlider
									leftOption="female"
									rightOption="male"
									value={localStudentGender}
									onChange={setLocalStudentGender}
									leftLabel="Female"
									rightLabel="Male"
									size="sm"
									className="w-full"
								/>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div
						className={`flex gap-1.5 md:gap-2 border-t ${darkModeColors.border} px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3`}
					>
						<button
							type="button"
							onClick={onClose}
							className={`flex-1 rounded-full border ${darkModeColors.borderMuted} ${darkModeColors.bgSurface} ${darkModeColors.textSecondary} px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[9px] sm:text-[10px] md:text-sm font-semibold transition ${darkModeColors.bgHoverLight}`}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleApply}
							className={`flex-1 rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[9px] sm:text-[10px] md:text-sm font-semibold text-white transition ${getThemeButtonClasses(
								theme.color
							)}`}
						>
							Apply
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
