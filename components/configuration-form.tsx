'use client';

import type { FormEvent } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { LevelSlider } from '@/components/level-slider';
import { LANGUAGE_TO_FLAG, LANGUAGES, LEVELS } from '@/lib/constants/languages';
import type { ChatConfig, GenderOption, StudentLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConfigurationFormProps {
	config: ChatConfig;
	onChange: (field: keyof ChatConfig) => (value: string) => void;
	onSubmit: (event: FormEvent) => void;
	onReset?: () => void;
	hasSession: boolean;
	isStarting: boolean;
	tutorGender: GenderOption;
	studentGender: GenderOption;
	onTutorGenderChange: (gender: GenderOption) => void;
	onStudentGenderChange: (gender: GenderOption) => void;
}

function getFlagPath(language: string): string | null {
	const countryCode = LANGUAGE_TO_FLAG[language];
	if (!countryCode) return null;
	return `/flags/l/${countryCode}.svg`;
}

function LanguageItem({ language }: { language: string }) {
	const flagPath = getFlagPath(language);

	return (
		<div className="flex items-center gap-2">
			{flagPath && (
				<Image
					src={flagPath}
					alt={`${language} flag`}
					width={20}
					height={15}
					className="rounded-sm"
				/>
			)}
			<span>{language}</span>
		</div>
	);
}

function GenderButton({
	label,
	selected,
	onClick,
}: {
	label: string;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 transition-all',
				selected
					? 'border-primary bg-primary/5 text-primary'
					: 'border-border bg-background text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50'
			)}
		>
			<User className={cn('h-4 w-4', selected && 'text-primary')} />
			<span className="text-sm font-medium">{label}</span>
		</button>
	);
}

export function ConfigurationForm({
	config,
	onChange,
	onSubmit,
	onReset,
	hasSession,
	isStarting,
	tutorGender,
	studentGender,
	onTutorGenderChange,
	onStudentGenderChange,
}: ConfigurationFormProps) {
	const sortedLanguages = [...LANGUAGES].sort();

	if (hasSession) {
		return (
			<div className="border-b border-border">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span>
							<span className="font-medium text-foreground">
								{config.foreignLanguage}
							</span>{' '}
							→ {config.nativeLanguage}
						</span>
						<span className="text-muted-foreground/50">•</span>
						<span>
							Level:{' '}
							<span className="font-medium text-foreground">
								{config.studentLevel}
							</span>
						</span>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onReset}
						className="h-7 px-3 text-xs"
					>
						Reset
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 justify-center overflow-auto px-6 pt-8">
			<form onSubmit={onSubmit} className="w-full max-w-xl space-y-6">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-foreground">
						Start your language practice
					</h2>
					<p className="mt-2 text-base text-muted-foreground">
						Choose your languages and level to begin
					</p>
				</div>

				<div className="space-y-5">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<label className="text-base font-medium text-foreground">
								Learning
							</label>
							<Select
								value={config.foreignLanguage}
								onValueChange={onChange('foreignLanguage')}
							>
								<SelectTrigger className="w-full">
									<SelectValue>
										<LanguageItem language={config.foreignLanguage} />
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{sortedLanguages.map((lang) => (
										<SelectItem key={lang} value={lang}>
											<LanguageItem language={lang} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-base font-medium text-foreground">
								Native Language
							</label>
							<Select
								value={config.nativeLanguage}
								onValueChange={onChange('nativeLanguage')}
							>
								<SelectTrigger className="w-full">
									<SelectValue>
										<LanguageItem language={config.nativeLanguage} />
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{sortedLanguages.map((lang) => (
										<SelectItem key={lang} value={lang}>
											<LanguageItem language={lang} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-base font-medium text-foreground">
							Proficiency Level
						</label>
						<LevelSlider
							value={config.studentLevel}
							onChange={onChange('studentLevel') as (value: string) => void}
							levels={LEVELS}
						/>
						<p className="text-sm text-muted-foreground text-center">
							{config.studentLevel === 'A1' &&
								'Beginner - Basic phrases and vocabulary'}
							{config.studentLevel === 'A2' &&
								'Elementary - Simple conversations'}
							{config.studentLevel === 'B1' && 'Intermediate - Everyday topics'}
							{config.studentLevel === 'B2' &&
								'Upper Intermediate - Complex discussions'}
							{config.studentLevel === 'C1' && 'Advanced - Fluent expression'}
							{config.studentLevel === 'C2' &&
								'Mastery - Near-native proficiency'}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-foreground">
								Tutor Voice
							</label>
							<div className="flex gap-2">
								<GenderButton
									label="Male"
									selected={tutorGender === 'male'}
									onClick={() => onTutorGenderChange('male')}
								/>
								<GenderButton
									label="Female"
									selected={tutorGender === 'female'}
									onClick={() => onTutorGenderChange('female')}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium text-foreground">
								Your Voice
							</label>
							<div className="flex gap-2">
								<GenderButton
									label="Male"
									selected={studentGender === 'male'}
									onClick={() => onStudentGenderChange('male')}
								/>
								<GenderButton
									label="Female"
									selected={studentGender === 'female'}
									onClick={() => onStudentGenderChange('female')}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<Button
						type="submit"
						disabled={isStarting}
						size="lg"
						className="px-8"
					>
						{isStarting ? 'Starting...' : "Let's Chat"}
					</Button>
				</div>
			</form>
		</div>
	);
}
