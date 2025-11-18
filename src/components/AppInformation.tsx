export const AppInformation = () => {
	return (
		<div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg max-h-[calc(100vh-2.75rem)] sm:max-h-[calc(100vh-3.5rem)]">
			<div className="flex-1 overflow-y-auto p-4 sm:p-6">
				<div className="mx-auto max-w-3xl space-y-6">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
							Korli Language Tutor
						</h1>
						<p className="mt-2 text-sm sm:text-base text-slate-600">
							AI-powered language learning chat interface
						</p>
					</div>

					<div>
						<h2 className="text-lg sm:text-xl font-semibold text-slate-900">
							About
						</h2>
						<p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700">
							Korli is an AI-powered language learning application that enables
							users to practice foreign languages through interactive
							conversations with an AI tutor. Practice your language skills in a
							natural, conversational setting with real-time feedback and
							corrections.
						</p>
					</div>

					<div>
						<h2 className="text-lg sm:text-xl font-semibold text-slate-900">
							Key Features
						</h2>
						<ul className="mt-2 space-y-2 text-sm sm:text-base text-slate-700">
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Language Configuration:</strong> Select native and
									foreign languages, proficiency level (A1-C2), and
									tutor/student genders
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Text Chat:</strong> Type messages and receive
									streaming AI responses in real-time
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Voice Chat:</strong> Record audio messages, get
									automatic transcription, and receive spoken responses
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Real-time Streaming:</strong> Server-Sent Events (SSE)
									for live AI response streaming
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Grammar Corrections:</strong> Automatic correction of
									user messages with explanations
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Translations:</strong> Toggle between foreign language
									and native language translations
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-500">•</span>
								<span>
									<strong>Audio Playback:</strong> Listen to AI responses for
									pronunciation practice
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg sm:text-xl font-semibold text-slate-900">
							Technology Stack
						</h2>
						<p className="mt-2 text-sm sm:text-base text-slate-700">
							Built with React, TypeScript, and Tailwind CSS for a modern,
							responsive user experience.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

