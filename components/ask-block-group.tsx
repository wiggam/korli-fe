'use client';

import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AskBlockGroupProps {
	blockId: string;
	messages: ChatMessage[];
	isCollapsed: boolean;
	onToggleCollapse: (blockId: string) => void;
	children: ReactNode;
}

export function AskBlockGroup({
	blockId,
	messages,
	isCollapsed,
	onToggleCollapse,
	children,
}: AskBlockGroupProps) {
	// Get the first user message for the summary
	const firstUserMessage = useMemo(() => {
		return messages.find((m) => m.role === 'user');
	}, [messages]);

	const summary = useMemo(() => {
		if (!firstUserMessage) return 'Question';
		const content = firstUserMessage.content;
		if (content.length <= 60) return content;
		return `${content.slice(0, 57)}...`;
	}, [firstUserMessage]);

	return (
		<div
			className={cn(
				'rounded-lg border transition-all duration-200',
				'border-violet-200 bg-violet-50/50 dark:border-violet-800/50 dark:bg-violet-950/20'
			)}
			data-ask-block-id={blockId}
		>
			{/* Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={() => onToggleCollapse(blockId)}
				className={cn(
					'flex w-full items-center justify-between gap-2 rounded-t-lg px-3 py-2 text-left',
					'hover:bg-violet-100/50 dark:hover:bg-violet-900/30',
					!isCollapsed && 'border-b border-violet-200 dark:border-violet-800/50'
				)}
			>
				<div className="flex items-center gap-2">
					<HelpCircle className="h-4 w-4 text-violet-600 dark:text-violet-400" />
					<span className="text-xs font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">
						Question
					</span>
					{isCollapsed && (
						<span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
							— {summary}
						</span>
					)}
				</div>
				{isCollapsed ? (
					<ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-violet-600 dark:text-violet-400" />
				)}
			</Button>

			{/* Content */}
			{!isCollapsed && (
				<div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
					{children}
				</div>
			)}
		</div>
	);
}

