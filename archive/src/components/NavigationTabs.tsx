import { MessageSquare, Info } from 'lucide-react';
import { TwoOptionSlider } from './TwoOptionSlider';

interface NavigationTabsProps {
	activePage: 'chat' | 'info';
	onPageChange: (page: 'chat' | 'info') => void;
}

export const NavigationTabs = ({
	activePage,
	onPageChange,
}: NavigationTabsProps) => {
	return (
		<div
			className="flex justify-center"
			role="tablist"
			aria-label="Page navigation"
		>
			<TwoOptionSlider
				leftOption="chat"
				rightOption="info"
				value={activePage}
				onChange={onPageChange}
				leftLabel="Chat"
				rightLabel="Info"
				leftIcon={<MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
				rightIcon={<Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
				size="md"
				className="min-w-[90px] sm:min-w-[110px]"
			/>
		</div>
	);
};
