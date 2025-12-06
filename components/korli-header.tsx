'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Info } from 'lucide-react';

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function KorliHeader() {
	const pathname = usePathname();

	const isChat = pathname === '/' || pathname.startsWith('/chat');
	const isInfo = pathname === '/info';

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				<nav className="flex items-center gap-1">
					<Link href="/">
						<Button
							variant={isChat ? 'secondary' : 'ghost'}
							size="sm"
							className={cn(
								'gap-1.5 px-3',
								isChat && 'bg-accent text-accent-foreground'
							)}
						>
							<MessageSquare className="h-4 w-4" />
							<span className="hidden sm:inline">Chat</span>
						</Button>
					</Link>
					<Link href="/info">
						<Button
							variant={isInfo ? 'secondary' : 'ghost'}
							size="sm"
							className={cn(
								'gap-1.5 px-3',
								isInfo && 'bg-accent text-accent-foreground'
							)}
						>
							<Info className="h-4 w-4" />
							<span className="hidden sm:inline">Info</span>
						</Button>
					</Link>
				</nav>

				<div className="absolute left-1/2 -translate-x-1/2">
					<Link href="/" className="flex items-center">
						{/* Light mode logo */}
						<Image
							src="/korli-logo.png"
							alt="Korli"
							width={48}
							height={16}
							className="h-3 sm:h-4 dark:hidden"
							style={{ width: 'auto', height: 'auto' }}
							priority
						/>
						{/* Dark mode logo */}
						<Image
							src="/korli-logo-white.png"
							alt="Korli"
							width={48}
							height={16}
							className="hidden h-3 sm:h-4 dark:block"
							style={{ width: 'auto', height: 'auto' }}
							priority
						/>
					</Link>
				</div>

				<div className="flex items-center">
					<AnimatedThemeToggler className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:h-4 [&_svg]:w-4" />
				</div>
			</div>
		</header>
	);
}
