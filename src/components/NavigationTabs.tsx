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
		<div className="flex justify-center" role="tablist" aria-label="Page navigation">
			<TwoOptionSlider
				leftOption="chat"
				rightOption="info"
				value={activePage}
				onChange={onPageChange}
				leftLabel="Chat"
				rightLabel="Info"
				size="md"
			/>
		</div>
	);
};

