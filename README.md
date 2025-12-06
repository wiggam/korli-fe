# Korli - AI Language Coach

A modern Next.js chatbot application for language learning, built on Vercel's chatbot template.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

Or if you have pnpm:
```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Replace `http://localhost:8000` with your Korli backend API URL.

### Development

Run the development server:

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📁 Project Structure

```
korli-fe/
├── app/                    # Next.js app directory
│   ├── (chat)/            # Chat route group
│   ├── info/              # Information page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── korli-chat.tsx     # Main chat component
│   ├── korli-input.tsx    # Input with voice recording
│   ├── korli-messages.tsx # Message list
│   ├── message-bubble.tsx # Individual message
│   └── ui/                # UI primitives
├── hooks/                 # Custom React hooks
│   └── use-korli-chat.ts  # Chat state management
├── lib/                   # Utilities and API
│   ├── korli-api.ts       # Backend API integration
│   ├── constants/         # Constants (languages, etc.)
│   └── types.ts           # TypeScript types
├── public/                # Static assets
│   ├── flags/             # Language flag icons
│   └── *.png              # Images
└── archive/               # Old Vite/React code (archived)
```

## 🎯 Features

- **Language Selection**: Choose from 57+ supported languages
- **Proficiency Levels**: A1-C2 CEFR levels
- **Voice Recording**: Record and transcribe voice messages
- **Audio Playback**: Listen to AI responses and corrections
- **Translations**: Instant translations of AI messages
- **Smart Corrections**: Get corrected versions of your messages
- **Gender Settings**: Customize tutor and student voice genders
- **Light/Dark Mode**: Beautiful theme switching

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the environment variable `NEXT_PUBLIC_API_BASE_URL` to your backend URL
4. Deploy!

The app will automatically build and deploy on every push to your main branch.

## 📝 Notes

- The old Vite/React code has been moved to the `archive/` folder
- This is a Next.js 16 application using the App Router
- Uses Tailwind CSS v4 for styling
- Built with TypeScript for type safety
