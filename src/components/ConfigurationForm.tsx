import type { ChangeEvent, FormEvent } from 'react';

import type { ChatConfig, GenderOption, StudentLevel } from '../types/chat';

interface ConfigurationFormProps {
	config: ChatConfig;
	languages: string[];
	levels: StudentLevel[];
	genders: GenderOption[];
	onChange: (field: keyof ChatConfig) => (event: ChangeEvent<HTMLSelectElement>) => void;
	onSubmit: (event: FormEvent) => void;
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
	hasSession,
	isStarting,
}: ConfigurationFormProps) => {
	if (hasSession) {
		// Compact mode - horizontal layout above chat
		return (
			<form onSubmit={onSubmit} className="border-b border-slate-200 p-4">
				<div className="flex flex-wrap items-end gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-slate-600">Foreign</label>
						<select
							value={config.foreignLanguage}
							onChange={onChange('foreignLanguage')}
							className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
							size={1}
						>
							{languages.map((language) => (
								<option key={language} value={language}>
									{language}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-slate-600">Native</label>
						<select
							value={config.nativeLanguage}
							onChange={onChange('nativeLanguage')}
							className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
							size={1}
						>
							{languages.map((language) => (
								<option key={language} value={language}>
									{language}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-slate-600">Level</label>
						<select
							value={config.studentLevel}
							onChange={onChange('studentLevel')}
							className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
							size={1}
						>
							{levels.map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-slate-600">Tutor</label>
						<select
							value={config.tutorGender}
							onChange={onChange('tutorGender')}
							className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 capitalize focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
							size={1}
						>
							{genders.map((gender) => (
								<option key={gender} value={gender} className="capitalize">
									{gender}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-medium text-slate-600">Student</label>
						<select
							value={config.studentGender}
							onChange={onChange('studentGender')}
							className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 capitalize focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
							size={1}
						>
							{genders.map((gender) => (
								<option key={gender} value={gender} className="capitalize">
									{gender}
								</option>
							))}
						</select>
					</div>

					<button
						type="submit"
						disabled={isStarting}
						className="h-9 rounded-full bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isStarting ? 'Restarting…' : 'Restart'}
					</button>
				</div>
			</form>
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
							<select
								value={config.foreignLanguage}
								onChange={onChange('foreignLanguage')}
								className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
								size={1}
							>
								{languages.map((language) => (
									<option key={language} value={language}>
										{language}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-slate-700">
								Native Language
							</label>
							<select
								value={config.nativeLanguage}
								onChange={onChange('nativeLanguage')}
								className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
								size={1}
							>
								{languages.map((language) => (
									<option key={language} value={language}>
										{language}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-slate-700">
								Student Level
							</label>
							<select
								value={config.studentLevel}
								onChange={onChange('studentLevel')}
								className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
								size={1}
							>
								{levels.map((level) => (
									<option key={level} value={level}>
										{level}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Row 2: Tutor and Student Gender */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-slate-700">Tutor Gender</label>
							<select
								value={config.tutorGender}
								onChange={onChange('tutorGender')}
								className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 capitalize focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
								size={1}
							>
								{genders.map((gender) => (
									<option key={gender} value={gender} className="capitalize">
										{gender}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-slate-700">
								Student Gender
							</label>
							<select
								value={config.studentGender}
								onChange={onChange('studentGender')}
								className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 capitalize focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
								size={1}
							>
								{genders.map((gender) => (
									<option key={gender} value={gender} className="capitalize">
										{gender}
									</option>
								))}
							</select>
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

