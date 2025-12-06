'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, MessageSquare, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function KorliHeader() {
	const pathname = usePathname();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
						<Image
							src={
								mounted && resolvedTheme === 'dark'
									? '/korli-logo-white.png'
									: '/korli-logo.png'
							}
							alt="Korli"
							width={80}
							height={28}
							className="h-6 w-auto sm:h-7"
							priority
						/>
					</Link>
				</div>

				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
						}
						className="h-8 w-8 p-0"
					>
						<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
