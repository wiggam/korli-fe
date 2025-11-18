import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';

interface NavigationTabsProps {
	activePage: 'chat' | 'info';
	onPageChange: (page: 'chat' | 'info') => void;
}

export const NavigationTabs = ({
	activePage,
	onPageChange,
}: NavigationTabsProps) => {
	const { theme } = useTheme();
	const themeClasses = getThemeColorClasses(theme.color);

	return (
		<div className="flex justify-center" role="tablist" aria-label="Page navigation">
			<div className={`relative inline-flex rounded-full ${darkModeColors.tabBg} p-0.5`}>
				{/* Sliding indicator - positioned behind buttons */}
				<div
					className="absolute top-0.5 bottom-0.5 left-0.5 right-0.5 rounded-full overflow-hidden"
					aria-hidden="true"
				>
					<div
						className={`h-full w-1/2 rounded-full ${themeClasses.primary} transition-transform duration-300 ease-in-out ${
							activePage === 'chat' ? 'translate-x-0' : 'translate-x-full'
						}`}
					/>
				</div>
				
				{/* Buttons container - equal width buttons */}
				<div className="relative flex w-full">
					<button
						type="button"
						role="tab"
						aria-selected={activePage === 'chat'}
						aria-controls="chat-panel"
						onClick={() => onPageChange('chat')}
						className={`relative z-10 flex flex-1 items-center justify-center h-5 sm:h-6 px-2.5 sm:px-3 rounded-full text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
							activePage === 'chat'
								? darkModeColors.tabTextActive
								: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
						}`}
					>
						Chat
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activePage === 'info'}
						aria-controls="info-panel"
						onClick={() => onPageChange('info')}
						className={`relative z-10 flex flex-1 items-center justify-center h-5 sm:h-6 px-2.5 sm:px-3 rounded-full text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
							activePage === 'info'
								? darkModeColors.tabTextActive
								: `${darkModeColors.tabText} ${darkModeColors.tabHover}`
						}`}
					>
						Info
					</button>
				</div>
			</div>
		</div>
	);
};

