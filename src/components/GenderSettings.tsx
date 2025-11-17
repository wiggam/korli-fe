import { useState } from 'react';

import type { GenderOption } from '../types/chat';

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
	const [localTutorGender, setLocalTutorGender] = useState<GenderOption>(tutorGender);
	const [localStudentGender, setLocalStudentGender] = useState<GenderOption>(studentGender);

	const handleApply = () => {
		onApply(localTutorGender, localStudentGender);
		onClose();
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
			<div className="w-full max-w-[240px] sm:max-w-[280px] rounded-xl border border-slate-200 bg-white shadow-xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-200 px-2.5 sm:px-3 py-1.5 sm:py-2">
					<h2 className="text-xs sm:text-sm font-semibold text-slate-900">Gender Settings</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
						aria-label="Close"
					>
						<CloseIcon />
					</button>
				</div>

				{/* Content */}
				<div className="space-y-2.5 sm:space-y-3 px-2.5 sm:px-3 py-2.5 sm:py-3">
					{/* Tutor Gender */}
					<div className="space-y-1.5">
						<label className="text-[9px] sm:text-[10px] font-medium text-slate-700">Tutor Gender</label>
						<div className="flex gap-1.5">
							<button
								type="button"
								onClick={() => setLocalTutorGender('female')}
								className={`flex-1 rounded-full border-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold transition ${
									localTutorGender === 'female'
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
								}`}
							>
								Female
							</button>
							<button
								type="button"
								onClick={() => setLocalTutorGender('male')}
								className={`flex-1 rounded-full border-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold transition ${
									localTutorGender === 'male'
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
								}`}
							>
								Male
							</button>
						</div>
					</div>

					{/* Student Gender */}
					<div className="space-y-1.5">
						<label className="text-[9px] sm:text-[10px] font-medium text-slate-700">Student Gender</label>
						<div className="flex gap-1.5">
							<button
								type="button"
								onClick={() => setLocalStudentGender('female')}
								className={`flex-1 rounded-full border-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold transition ${
									localStudentGender === 'female'
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
								}`}
							>
								Female
							</button>
							<button
								type="button"
								onClick={() => setLocalStudentGender('male')}
								className={`flex-1 rounded-full border-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold transition ${
									localStudentGender === 'male'
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
								}`}
							>
								Male
							</button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-1.5 border-t border-slate-200 px-2.5 sm:px-3 py-1.5 sm:py-2">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 rounded-full border border-slate-300 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleApply}
						className="flex-1 rounded-full bg-blue-500 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold text-white transition hover:bg-blue-400"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
		</>
	);
};

