import type { FormEvent } from 'react';

import { Dropdown } from './Dropdown';
import type { ChatConfig, GenderOption, StudentLevel } from '../types/chat';

interface ConfigurationFormProps {
	config: ChatConfig;
	languages: string[];
	levels: StudentLevel[];
	genders: GenderOption[];
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
	genders,
	onChange,
	onSubmit,
	onReset,
	hasSession,
	isStarting,
}: ConfigurationFormProps) => {
	if (hasSession) {
		// Text display mode - show current config as text with restart button
		return (
			<div className="border-b border-slate-200 p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
						<span>
							<span className="font-medium text-slate-900">{config.foreignLanguage}</span> →{' '}
							{config.nativeLanguage}
						</span>
						<span className="text-slate-400">•</span>
						<span>
							Level: <span className="font-medium text-slate-900">{config.studentLevel}</span>
						</span>
						<span className="text-slate-400">•</span>
						<span>
							Tutor:{' '}
							<span className="font-medium text-slate-900 capitalize">{config.tutorGender}</span>
						</span>
						<span className="text-slate-400">•</span>
						<span>
							Student:{' '}
							<span className="font-medium text-slate-900 capitalize">
								{config.studentGender}
							</span>
						</span>
					</div>

				<button
					type="button"
					onClick={onReset}
					className="h-9 rounded-full bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
				>
					Restart
				</button>
				</div>
			</div>
		);
	}

	// Centered mode - prominent layout in empty chat
	return (
		<div className="flex min-h-[520px] items-center justify-center p-8">
			<form onSubmit={onSubmit} className="w-full max-w-3xl space-y-6">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-slate-900">
						Start Your Language Practice
					</h2>
					<p className="mt-2 text-sm text-slate-600">
						Configure your learning preferences to begin
					</p>
				</div>

				<div className="space-y-4">
					{/* Row 1: Foreign, Native, Level */}
					<div className="grid gap-4 sm:grid-cols-3">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-slate-700">
							Foreign Language
						</label>
						<Dropdown
							value={config.foreignLanguage}
							options={languages}
							onChange={onChange('foreignLanguage')}
							searchable={true}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-slate-700">
							Native Language
						</label>
						<Dropdown
							value={config.nativeLanguage}
							options={languages}
							onChange={onChange('nativeLanguage')}
							searchable={true}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-slate-700">
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

					{/* Row 2: Tutor and Student Gender */}
					<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-slate-700">Tutor Gender</label>
						<Dropdown
							value={config.tutorGender}
							options={genders}
							onChange={onChange('tutorGender')}
							searchable={false}
							capitalize={true}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-slate-700">
							Student Gender
						</label>
						<Dropdown
							value={config.studentGender}
							options={genders}
							onChange={onChange('studentGender')}
							searchable={false}
							capitalize={true}
						/>
					</div>
					</div>
				</div>

				<div className="flex justify-center pt-2">
					<button
						type="submit"
						disabled={isStarting}
						className="h-12 rounded-full bg-blue-500 px-12 text-base font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isStarting ? 'Starting…' : 'Start Chat'}
					</button>
				</div>
			</form>
		</div>
	);
};

