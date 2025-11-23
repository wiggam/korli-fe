import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';
import type { StudentLevel } from '../types/chat';

interface LevelSliderProps {
	value: StudentLevel;
	onChange: (value: StudentLevel) => void;
	levels: StudentLevel[];
}

const getLevelLabel = (level: string) => level;

const getLevelDescription = (level: string) => {
	switch (level) {
		case 'A1':
			return '(Beginner)';
		case 'B1':
			return '(Intermediate)';
		case 'C1':
			return '(Advanced)';
		default:
			return null;
	}
};

export const LevelSlider = ({ value, onChange, levels }: LevelSliderProps) => {
	const { theme } = useTheme();
	const themeClasses = getThemeColorClasses(theme.color);
	const [isDragging, setIsDragging] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);

	const currentIndex = levels.indexOf(value);

	const handleClick = (level: StudentLevel) => {
		onChange(level);
	};

	const getPositionFromEvent = (clientX: number): StudentLevel | null => {
		if (!sliderRef.current) return null;

		const rect = sliderRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));

		const index = Math.round(percentage * (levels.length - 1));
		return levels[index];
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		const level = getPositionFromEvent(e.clientX);
		if (level) onChange(level);
	};

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!sliderRef.current) return;
			const rect = sliderRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = Math.max(0, Math.min(1, x / rect.width));
			const index = Math.round(percentage * (levels.length - 1));
			const level = levels[index];
			if (level) onChange(level);
		};

		const handleMouseUp = () => setIsDragging(false);

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, onChange, levels]);

	const handleTouchStart = (e: React.TouchEvent) => {
		setIsDragging(true);
		const touch = e.touches[0];
		const level = getPositionFromEvent(touch.clientX);
		if (level) onChange(level);
	};

	useEffect(() => {
		if (!isDragging) return;

		const handleTouchMove = (e: TouchEvent) => {
			if (!sliderRef.current) return;
			const touch = e.touches[0];
			const rect = sliderRef.current.getBoundingClientRect();
			const x = touch.clientX - rect.left;
			const percentage = Math.max(0, Math.min(1, x / rect.width));
			const index = Math.round(percentage * (levels.length - 1));
			const level = levels[index];
			if (level) onChange(level);
		};

		const handleTouchEnd = () => setIsDragging(false);

		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, [isDragging, onChange, levels]);

	const indicatorPosition =
		currentIndex >= 0 && levels.length > 0
			? ((currentIndex + 0.5) / levels.length) * 100
			: 0;

	return (
		<div className="w-full">
			{/* Timeline track */}
			<div
				ref={sliderRef}
				className={`relative h-2 rounded-full ${darkModeColors.sliderBg} cursor-pointer select-none`}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
			>
				{/* Active track */}
				<div
					className={`absolute h-2 rounded-full ${themeClasses.primary} transition-all duration-300 ease-out`}
					style={{ width: `${indicatorPosition}%` }}
				/>

				{/* Dots (grid so centers line up with labels) */}
				<div
					className="relative grid h-2 items-center"
					style={{
						gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`,
					}}
				>
					{levels.map((level, index) => {
						const isSelected = level === value;
						const isActive = index <= currentIndex;
						return (
							<button
								key={level}
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClick(level);
								}}
								className={`relative z-10 -mt-1 h-4 w-4 rounded-full border-2 transition-all duration-200 mx-auto ${
									isSelected
										? `${themeClasses.border} ${themeClasses.primary} ring-2 ${themeClasses.ring} ring-offset-2 ring-offset-white dark:ring-offset-slate-500`
										: isActive
										? `${themeClasses.border} ${themeClasses.primary}`
										: `border-slate-300 dark:border-slate-400 ${darkModeColors.bgSurface}`
								}`}
								aria-label={`Select level ${level}`}
							/>
						);
					})}
				</div>
			</div>

			{/* Labels (same grid layout as dots) */}
			<div
				className="relative mt-4 grid"
				style={{
					gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`,
				}}
			>
				{levels.map((level) => {
					const isSelected = level === value;
					const description = getLevelDescription(level);

					return (
						<button
							key={level}
							type="button"
							onClick={() => handleClick(level)}
							className="flex flex-col items-center transition-colors"
							aria-label={`Select level ${level}`}
						>
							<span
								className={`text-xs sm:text-sm font-medium ${
									isSelected
										? `${themeClasses.darkText} dark:text-white`
										: darkModeColors.textMuted
								}`}
							>
								{getLevelLabel(level)}
							</span>
							{description && (
								<span
									className={`text-[10px] sm:text-xs font-normal leading-tight ${
										isSelected
											? `${themeClasses.darkText} dark:text-white`
											: darkModeColors.textMuted
									}`}
								>
									{description}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
