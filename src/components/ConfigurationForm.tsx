import type { FormEvent } from 'react';

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
	if (hasSession) {
		// Text display mode - show current config as text with restart button
		return (
			<div className="border-b border-slate-200 p-3">
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
						<span>
							<span className="font-medium text-slate-900">{config.foreignLanguage}</span> →{' '}
							{config.nativeLanguage}
						</span>
						<span className="text-slate-400">•</span>
						<span>
							Level: <span className="font-medium text-slate-900">{config.studentLevel}</span>
						</span>
					</div>

				<button
					type="button"
					onClick={onReset}
					className="h-8 rounded-full bg-slate-100 px-5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
				>
					Restart
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
					<h2 className="text-xl font-semibold text-slate-900">
						Start Your Language Practice
					</h2>
					<p className="mt-2 text-xs text-slate-600">
						Configure your learning preferences to begin
					</p>
				</div>

				<div className="space-y-3">
					{/* Row: Foreign, Native, Level */}
					<div className="grid gap-3 sm:grid-cols-3">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							Foreign Language
						</label>
						<Dropdown
							value={config.foreignLanguage}
							options={languages}
							onChange={onChange('foreignLanguage')}
							searchable={true}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							Native Language
						</label>
						<Dropdown
							value={config.nativeLanguage}
							options={languages}
							onChange={onChange('nativeLanguage')}
							searchable={true}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							Student Level
						</label>
						<Dropdown
							value={config.studentLevel}
							options={levels}
							onChange={onChange('studentLevel')}
							searchable={false}
						/>
					</div>
					</div>
				</div>

				<div className="flex justify-center pt-2">
					<button
						type="submit"
						disabled={isStarting}
						className="h-10 rounded-full bg-blue-500 px-10 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isStarting ? 'Starting…' : 'Start Chat'}
					</button>
				</div>
			</form>
		</div>
	);
};

