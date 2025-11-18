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
						<h2 className="text-xs sm:text-sm font-semibold text-slate-900">Settings</h2>
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
						{/* Empty for now */}
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
					</div>
				</div>
			</div>
		</>
	);
};

