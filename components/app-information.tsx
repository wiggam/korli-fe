'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
	Globe,
	Languages,
	Volume2,
	Mic,
	Shield,
	Moon,
	Sun,
	User,
	GraduationCap,
	ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KorliHeader } from '@/components/korli-header';
import { LANGUAGES } from '@/lib/constants/languages';

export function AppInformation() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<KorliHeader />

			<main className="flex-1">
				<section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/30 to-background px-4 py-16 sm:py-24">
					<div className="mx-auto max-w-4xl text-center">
						<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
							Your AI Language Coach
						</h1>
						<p className="mx-auto mt-4 max-w-xl text-xl text-muted-foreground sm:mt-6 sm:text-2xl">
							Practice conversations at your level. Get instant corrections,
							translations, and audio playback to accelerate your language
							learning.
						</p>
						<div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Link href="/">
								<Button size="lg" className="gap-2">
									Start Chatting
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				<section className="border-b border-border px-4 py-16">
					<div className="mx-auto max-w-4xl">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Globe className="h-5 w-5" />
							</div>
							<h2 className="text-2xl font-semibold text-foreground">
								Language Support
							</h2>
						</div>
						<p className="mt-4 text-lg text-muted-foreground">
							Practice in any of our {LANGUAGES.length} supported languages.
							Select your target language and native language to get started.
						</p>

						<div className="mt-6 flex flex-wrap gap-2">
							{LANGUAGES.slice(0, 20).map((lang) => (
								<span
									key={lang}
									className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground"
								>
									{lang}
								</span>
							))}
							<span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
								+{LANGUAGES.length - 20} more
							</span>
						</div>
					</div>
				</section>

				<section className="border-b border-border px-4 py-16">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
							Everything you need to learn faster
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
							Korli combines adaptive conversations with powerful learning tools
							to help you improve quickly.
						</p>

						<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
										<GraduationCap className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Adaptive Learning
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Choose your proficiency level (A1-C2) and Korli adapts the
										conversation complexity to match.
									</p>
								</CardContent>
							</Card>

							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
										<Languages className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Instant Translations
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Tap translate on any AI message to instantly see it in your
										native language.
									</p>
								</CardContent>
							</Card>

							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
										<Volume2 className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Audio Playback
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Listen to AI messages spoken aloud to improve your listening
										skills and pronunciation.
									</p>
								</CardContent>
							</Card>

							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
										<Shield className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Smart Corrections
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Get gentle corrections on your messages with the proper
										phrasing and audio playback.
									</p>
								</CardContent>
							</Card>

							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
										<Mic className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Voice Recording
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Record voice messages that are transcribed and sent to your
										tutor for natural conversation.
									</p>
								</CardContent>
							</Card>

							<Card className="border-border bg-card">
								<CardContent className="p-6">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
										<User className="h-5 w-5" />
									</div>
									<h3 className="mt-4 font-semibold text-foreground">
										Customization
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										Choose your tutor's voice gender and your student voice for
										playback of your corrected messages.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className="border-b border-border px-4 py-16">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
							See it in action
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
							Here's what translations and corrections look like during a
							conversation.
						</p>

						<div className="mt-12 grid gap-8 md:grid-cols-2">
							<div className="space-y-3">
								<h3 className="font-medium text-foreground">Translation</h3>
								<div className="overflow-hidden rounded-lg border border-border">
									<Image
										src="/translation-example.png"
										alt="Translation example"
										width={500}
										height={300}
										className="w-full"
									/>
								</div>
								<p className="text-base text-muted-foreground">
									Tap the translate button to see any message in your native
									language.
								</p>
							</div>

							<div className="space-y-3">
								<h3 className="font-medium text-foreground">Correction</h3>
								<div className="overflow-hidden rounded-lg border border-border">
									<Image
										src="/correction-example.png"
										alt="Correction example"
										width={500}
										height={300}
										className="w-full"
									/>
								</div>
								<p className="text-base text-muted-foreground">
									When you make a mistake, Korli gently shows you the correct
									phrasing.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="px-4 py-16">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
							Ready to start learning?
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
							Begin a conversation with your AI tutor right now. No account
							needed.
						</p>
						<div className="mt-8">
							<Link href="/">
								<Button size="lg" className="gap-2">
									Start Chatting
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-border bg-muted/30 px-4 py-6">
				<div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Korli. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
