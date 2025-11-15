# Frontend Guide for Backend Developers

## Project Overview

**Korli Language Tutor** is an AI-powered language learning chat interface built as a React single-page application (SPA). The application enables users to practice foreign languages through interactive conversations with an AI tutor.

### Key Features

- **Language Configuration**: Select native and foreign languages, proficiency level (A1-C2), and tutor/student genders
- **Text Chat**: Type messages and receive streaming AI responses in real-time
- **Voice Chat**: Record audio messages, get automatic transcription, and receive spoken responses
- **Real-time Streaming**: Server-Sent Events (SSE) for live AI response streaming
- **Grammar Corrections**: Automatic correction of user messages with explanations
- **Translations**: Toggle between foreign language and native language translations
- **Audio Playback**: Listen to AI responses for pronunciation practice

---

## Tech Stack Deep Dive

### React (^19.2.0)

**What is React?**

React is a JavaScript library for building user interfaces using reusable components. If you're familiar with backend frameworks:
- **Components** are like templates/views (e.g., Jinja2, Blade, ERB)
- **Props** are like function parameters passed to templates
- **State** is like session data that causes re-renders when changed

**How it works:**
- Components are JavaScript functions that return HTML-like syntax called JSX
- When data (state) changes, React automatically re-renders affected components
- Think of it as a reactive templating system that updates the DOM efficiently

**Example:**
```tsx
// A component is just a function that returns UI
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### TypeScript (~5.9.3)

**What is TypeScript?**

TypeScript is a superset of JavaScript that adds static typing. If you've used Java, C#, Go, or Rust, this will feel familiar.

**Key Benefits:**
- **Static Type Checking**: Catch type errors at compile-time, not runtime
- **IntelliSense**: Better IDE autocomplete and code navigation
- **Interfaces**: Define contracts for data structures (like DTOs or schemas)
- **Compiles to JavaScript**: Browsers don't run TypeScript directly

**Type annotations:**
```typescript
// Define types for function parameters and return values
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Define interfaces for objects (like backend models/DTOs)
interface User {
  id: string;
  name: string;
  email: string;
}
```

**In this project:**
- All `.ts` files contain TypeScript code (logic, utilities)
- All `.tsx` files contain TypeScript + JSX (React components)
- Type definitions are in `src/types/` directory

### Vite (^7.2.2)

**What is Vite?**

Vite is a build tool and development server. Think of it as:
- **Development**: Like `nodemon` or hot-reload for your backend
- **Production**: Like webpack but much faster for bundling/optimizing code

**What it does:**
- Starts a local development server with hot module replacement (HMR)
- Compiles TypeScript to JavaScript
- Bundles all code, assets, and dependencies for production
- Optimizes and minifies output files

**How it fits:**
- Vite reads `vite.config.ts` for configuration
- Uses plugins (like `@vitejs/plugin-react`) to handle React-specific transformations
- Outputs production builds to `dist/` directory

### Tailwind CSS (^3.4.15)

**What is Tailwind CSS?**

Tailwind is a utility-first CSS framework. Instead of writing custom CSS files, you apply pre-defined class names directly to HTML elements.

**Traditional CSS approach:**
```css
/* styles.css */
.button {
  background-color: blue;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
```
```html
<button class="button">Click me</button>
```

**Tailwind approach:**
```html
<button class="bg-blue-500 px-4 py-2 rounded-lg">Click me</button>
```

**Common patterns:**
- `bg-blue-500`: background color
- `px-4 py-2`: padding (horizontal 1rem, vertical 0.5rem)
- `rounded-lg`: border radius
- `text-white`: text color
- `hover:bg-blue-600`: hover state styling

**Configuration:**
- `tailwind.config.js`: Define custom colors, spacing, breakpoints
- `postcss.config.js`: CSS processing pipeline
- Custom colors for this project: `korli-dark`, `korli-muted`, etc.

---

## Programming Languages: What Does What?

This project uses three "languages" that work together:

### TypeScript/JavaScript (Primary Language)
- **Purpose**: All application logic, data processing, API calls, event handling
- **Where**: All `.ts` and `.tsx` files
- **Role**: This is the "brain" of the application
- **Execution**: Compiles to JavaScript, runs in the browser

### CSS (Styling Language)
- **Purpose**: Visual styling and layout
- **Where**: `src/index.css` (minimal global styles), Tailwind utilities (inline in components)
- **Role**: Makes the app look good
- **Execution**: Processed by PostCSS, bundled by Vite

### HTML (Markup Language)
- **Purpose**: Structure and content
- **Where**: Embedded in JSX/TSX files (looks like HTML but it's JavaScript)
- **Role**: Defines the DOM structure
- **Execution**: React converts JSX to actual DOM elements

**Important Note:**
- They're **not** the same language, but they work together seamlessly
- TypeScript is where 95% of your logic lives (the "backend" of the frontend)
- CSS is purely presentational
- HTML (via JSX) is the structure that TypeScript manipulates

---

## Directory Structure Explained

```
korli-fe/
├── src/                        # Source code (where you write code)
│   ├── components/             # Reusable UI components
│   │   ├── AudioPlayer.tsx     # Plays audio messages
│   │   ├── ChatWindow.tsx      # Displays message list
│   │   ├── InputBar.tsx        # Message input (text/voice)
│   │   └── MessageBubble.tsx   # Individual message UI
│   │
│   ├── hooks/                  # Custom React hooks (business logic)
│   │   └── useChat.ts          # Main chat state & logic
│   │
│   ├── lib/                    # Utility libraries
│   │   └── api.ts              # Backend API client (HTTP/SSE)
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── chat.ts             # Interfaces for chat data structures
│   │
│   ├── constants/              # Static configuration data
│   │   └── languages.ts        # List of supported languages
│   │
│   ├── App.tsx                 # Main application component (root)
│   ├── main.tsx                # Entry point (bootstraps React)
│   └── index.css               # Global CSS styles
│
├── public/                     # Static assets (served as-is)
│   └── vite.svg                # Favicon/logo
│
├── dist/                       # Production build output (generated)
│   ├── assets/                 # Bundled JS/CSS with hashed filenames
│   └── index.html              # Entry HTML file
│
├── node_modules/               # Dependencies (like vendor/ or site-packages/)
│
├── package.json                # Dependencies & scripts (like requirements.txt + Makefile)
├── package-lock.json           # Locked dependency versions (like poetry.lock)
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript compiler settings
├── tsconfig.app.json           # TypeScript config for app code
├── tsconfig.node.json          # TypeScript config for config files
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # CSS processing configuration
├── eslint.config.js            # Linting rules
├── .env                        # Environment variables (not in git)
└── .gitignore                  # Git ignore patterns
```

### Directory Purposes (Backend Analogy)

| Directory | Backend Equivalent | Purpose |
|-----------|-------------------|---------|
| `src/components/` | Views/Templates | UI pieces that render HTML |
| `src/hooks/` | Services/Use Cases | Business logic and state management |
| `src/lib/` | Clients/SDKs | Utility functions (API client, helpers) |
| `src/types/` | Models/DTOs | Data structure definitions |
| `src/constants/` | Config/Constants | Static data that doesn't change |
| `node_modules/` | vendor/, site-packages/ | Third-party dependencies |
| `dist/` | build/, target/ | Compiled production output |

---

## Key Areas for Backend Developers

### 1. Main Processing: `src/hooks/useChat.ts`

**What is this?**

This is essentially the **service layer** of your frontend. It contains all the business logic for managing chat state, handling streaming events, and coordinating API calls.

**Key responsibilities:**
- **State Management**: Tracks messages, thread ID, streaming status, errors
- **Event Handling**: Processes Server-Sent Events from the backend
- **API Orchestration**: Calls API functions and manages their lifecycle
- **Side Effects**: Audio URL cleanup, stream abortion, error handling

**Think of it as:**
- A service class that manages chat session lifecycle
- Similar to a `ChatService` in your backend that would handle WebSocket connections
- All the "business logic" that ties together API calls and UI state

**Key functions:**
- `startConversation()`: Initializes a new chat session
- `sendTextMessage()`: Sends text, initiates SSE stream
- `sendAudioMessage()`: Sends audio file, initiates SSE stream
- `handleStreamEvent()`: Routes SSE events to appropriate handlers

### 2. API Communication: `src/lib/api.ts`

**What is this?**

This is your **HTTP client** for backend communication. It's like using `requests` (Python), `axios` (Node.js), or `http.Client` (Go).

**Key functions:**

#### `startTextChat()`
```typescript
POST /api/chat/text
Content-Type: application/json

Body: {
  foreign_language: string,
  native_language: string,
  student_level: string,
  tutor_gender: string,
  student_gender: string
}

Response: {
  thread_id: string,
  ai_message: {
    content: string,
    translation?: string,
    audio_url?: string
  }
}
```

#### `continueTextChatSSE()`
```typescript
POST /api/chat/text (with SSE streaming)
Content-Type: application/json
Accept: text/event-stream

Body: {
  thread_id: string,
  message: string,
  stream: true,
  foreign_language: string
}

Response: Server-Sent Events stream
```

#### `voiceChatSSE()`
```typescript
POST /api/chat/voice (with SSE streaming)
Content-Type: multipart/form-data
Accept: text/event-stream

Body: FormData with:
  - thread_id: string
  - foreign_language: string
  - stream: "true"
  - audio_file: Blob (WebM audio)

Response: Server-Sent Events stream
```

**SSE Event Types:**
- `thread`: Backend assigns/confirms thread ID
- `transcript`: Audio transcription result
- `correction`: Grammar corrections for user message
- `assistant_start`: AI starts responding (creates message placeholder)
- `assistant_delta`: Streaming text chunks from AI
- `assistant_end`: AI finishes responding (provides full message + metadata)
- `done`: Stream complete

**Environment Configuration:**
- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:8000`)
- Vite requires `VITE_` prefix for environment variables exposed to frontend
- Set in `.env` file: `VITE_API_BASE_URL=https://api.production.com`

### 3. Type Definitions: `src/types/chat.ts`

**What is this?**

TypeScript interfaces that define data structures. These are like:
- **DTOs** (Data Transfer Objects) in Java/C#
- **Models** in Django/Rails
- **Structs** in Go
- **Pydantic models** in FastAPI

**Key types:**

```typescript
// Configuration for starting a chat
interface ChatConfig {
  nativeLanguage: string;
  foreignLanguage: string;
  studentLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  tutorGender: 'male' | 'female';
  studentGender: 'male' | 'female';
}

// AI message structure
interface AIMessage {
  id: string;
  role: 'ai';
  content: string;
  translation?: string;
  audioUrl?: string;
  createdAt: number;
  isStreaming?: boolean;
}

// User message structure
interface UserMessage {
  id: string;
  role: 'user';
  type: 'text' | 'audio';
  content: string;
  status: 'pending' | 'transcribing' | 'complete';
  createdAt: number;
  userAudio?: { localUrl?: string };
  correction?: {
    corrected: boolean;
    correctedMessage?: string;
    translation?: string;
    audioUrl?: string;
  };
}
```

**Why this matters:**
- TypeScript enforces these contracts at compile-time
- If backend changes response structure, TypeScript will show errors
- Acts as documentation for what data shapes to expect
- Prevents runtime errors from accessing undefined properties

### 4. Main Styling: `src/index.css` + `tailwind.config.js`

**Global Styles** (`src/index.css`):
```css
@tailwind base;      /* CSS reset + base styles */
@tailwind components; /* Tailwind component classes */
@tailwind utilities;  /* Utility classes (bg-blue-500, etc.) */

/* Custom global styles */
:root {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  background-color: #04070d;
}
```

**Custom Theme** (`tailwind.config.js`):
```javascript
theme: {
  extend: {
    colors: {
      'korli-dark': '#0c0c0f',     // Main background
      'korli-muted': '#10131a',    // Secondary background
      'korli-ai': '#f2f5ff',       // AI message background
      'korli-user': '#dfeeff',     // User message background
      'korli-border': '#dce1f0',   // Border color
    },
  },
}
```

**Usage in components:**
```tsx
<div className="bg-korli-dark text-white px-4 py-6">
  {/* This div has dark background, white text, padding */}
</div>
```

**Most styling is inline** using Tailwind classes. There are very few separate CSS files.

---

## How It All Works Together

### The Build and Runtime Flow

```
┌─────────────────────────────────────────────────────────────┐
│ DEVELOPMENT (npm run dev)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Vite starts development server (usually :5173)           │
│  2. TypeScript compiler watches .ts/.tsx files               │
│  3. Vite serves index.html which loads main.tsx              │
│  4. main.tsx renders App.tsx into the DOM                    │
│  5. React components render → Browser displays UI            │
│  6. When you edit a file, HMR instantly updates browser      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCTION (npm run build)                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. TypeScript compiles all .ts/.tsx → JavaScript           │
│  2. Vite bundles all JS files into optimized chunks         │
│  3. PostCSS processes Tailwind CSS → minified CSS            │
│  4. Assets are hashed for cache busting                      │
│  5. Output goes to dist/ directory                           │
│  6. dist/ can be deployed to any static file server          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### The Technology Stack

```
┌──────────────────────────────────────────────────────────────┐
│                         BROWSER                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  JavaScript Engine (V8, SpiderMonkey, etc.)            │  │
│  │  - Executes compiled JavaScript code                   │  │
│  │  - Handles React rendering and updates                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                            ↑                                  │
└────────────────────────────│──────────────────────────────────┘
                             │ (compiled JS + CSS)
┌────────────────────────────│──────────────────────────────────┐
│                         VITE                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Build Tool & Dev Server                               │  │
│  │  - Bundles modules                                     │  │
│  │  - Optimizes assets                                    │  │
│  │  - Serves files during development                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                            ↑                                  │
└────────────────────────────│──────────────────────────────────┘
                             │ (source files)
┌────────────────────────────┴──────────────────────────────────┐
│                    SOURCE CODE                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  TypeScript  │  │    React     │  │  Tailwind CSS    │    │
│  │              │  │              │  │                  │    │
│  │  - Type      │  │  - Components│  │  - Utility       │    │
│  │    safety    │  │  - State mgmt│  │    classes       │    │
│  │  - Interfaces│  │  - Rendering │  │  - Responsive    │    │
│  │              │  │              │  │    design        │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Component Rendering Flow

```
1. User opens browser → index.html loads
                         ↓
2. index.html loads main.tsx (entry point)
                         ↓
3. main.tsx renders <App /> component
                         ↓
4. App.tsx renders child components:
   - ChatWindow (displays messages)
   - InputBar (text/audio input)
   - MessageBubble (individual messages)
                         ↓
5. User interacts (clicks, types, records)
                         ↓
6. Event handlers call functions from useChat hook
                         ↓
7. useChat calls API functions (api.ts)
                         ↓
8. API makes HTTP request to backend
                         ↓
9. Backend responds (REST or SSE stream)
                         ↓
10. useChat updates state (messages, status, etc.)
                         ↓
11. React detects state change
                         ↓
12. React re-renders affected components
                         ↓
13. User sees updated UI
```

---

## Backend Communication Flow

### 1. Starting a Chat Session

**User Action**: Clicks "Start session" button

**Frontend Flow:**
```
App.tsx (handleStart)
    ↓
useChat.ts (startConversation)
    ↓
api.ts (startTextChat)
    ↓
POST /api/chat/text
    ↓
Backend responds with thread_id + initial AI message
    ↓
useChat updates state (threadId, messages)
    ↓
React re-renders → User sees AI greeting
```

**Request:**
```json
POST http://localhost:8000/api/chat/text
Content-Type: application/json

{
  "foreign_language": "Spanish",
  "native_language": "English",
  "student_level": "A2",
  "tutor_gender": "female",
  "student_gender": "female"
}
```

**Response:**
```json
{
  "thread_id": "thread_abc123",
  "ai_message": {
    "content": "¡Hola! ¿Cómo estás?",
    "translation": "Hello! How are you?",
    "audio_url": "https://example.com/audio/greeting.mp3"
  }
}
```

### 2. Sending a Text Message (with Streaming)

**User Action**: Types message and presses Enter

**Frontend Flow:**
```
InputBar.tsx (handleSubmit)
    ↓
useChat.ts (sendTextMessage)
    ↓
  1. Creates user message (optimistic UI update)
  2. Updates state → React shows user message immediately
    ↓
api.ts (continueTextChatSSE)
    ↓
POST /api/chat/text (with stream=true)
    ↓
Backend streams SSE events:
  - correction: Grammar corrections for user message
  - assistant_start: Creates AI message placeholder
  - assistant_delta: Streams AI response token by token
  - assistant_end: Provides final message + audio URL
  - done: Stream complete
    ↓
useChat.ts (handleStreamEvent)
    ↓
Updates messages state for each event
    ↓
React re-renders → User sees AI typing in real-time
```

**SSE Stream Example:**
```
event: correction
data: {"corrected": true, "corrected_message": "Estoy bien", "translation": "I am well"}

event: assistant_start
data: {"id": "msg_xyz789"}

event: assistant_delta
data: {"id": "msg_xyz789", "channel": "foreign", "text": "Me "}

event: assistant_delta
data: {"id": "msg_xyz789", "channel": "foreign", "text": "alegra "}

event: assistant_delta
data: {"id": "msg_xyz789", "channel": "foreign", "text": "oírlo."}

event: assistant_end
data: {"id": "msg_xyz789", "ai_message": "Me alegra oírlo.", "translation": "I'm glad to hear it.", "audio_url": "https://..."}

event: done
data: {}
```

### 3. Sending an Audio Message

**User Action**: Holds record button, speaks, releases

**Frontend Flow:**
```
InputBar.tsx (audio recording)
    ↓
MediaRecorder API records WebM audio
    ↓
useChat.ts (sendAudioMessage)
    ↓
  1. Creates user message with status="transcribing"
  2. Creates local URL for audio playback
  3. Updates state → React shows "Transcribing..." status
    ↓
api.ts (voiceChatSSE)
    ↓
POST /api/chat/voice (multipart/form-data)
    ↓
Backend streams SSE events:
  - transcript: Audio transcription result
  - correction: Grammar corrections
  - assistant_start, assistant_delta, assistant_end: AI response
  - done: Stream complete
    ↓
useChat.ts (handleStreamEvent)
    ↓
Updates user message with transcript and correction
Updates messages state with AI response
    ↓
React re-renders → User sees transcript + AI response
```

**Request:**
```
POST http://localhost:8000/api/chat/voice
Content-Type: multipart/form-data

------WebKitFormBoundary...
Content-Disposition: form-data; name="thread_id"

thread_abc123
------WebKitFormBoundary...
Content-Disposition: form-data; name="foreign_language"

Spanish
------WebKitFormBoundary...
Content-Disposition: form-data; name="stream"

true
------WebKitFormBoundary...
Content-Disposition: form-data; name="audio_file"; filename="message.webm"
Content-Type: audio/webm

<binary audio data>
------WebKitFormBoundary...--
```

### Server-Sent Events (SSE) Explained

**What is SSE?**

Server-Sent Events allow the server to push updates to the client over a single HTTP connection. Think of it as a one-way WebSocket (server → client only).

**Why use SSE here?**
- **Real-time streaming**: AI responses appear token-by-token (like ChatGPT)
- **Simpler than WebSockets**: No need for bidirectional communication
- **Automatic reconnection**: Browser handles connection drops
- **HTTP-based**: Works with standard HTTP infrastructure

**How it works:**
1. Client opens an HTTP connection with `Accept: text/event-stream`
2. Server keeps connection open and sends data as it becomes available
3. Each event has a name and JSON data
4. Connection closes when server sends final event or client aborts

**Frontend SSE handling** (in `api.ts`):
```typescript
// Simplified version
const startSSE = (url, body, callbacks) => {
  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: { 'Accept': 'text/event-stream' }
  });
  
  const reader = response.body.getReader();
  
  // Read stream chunk by chunk
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    // Parse SSE format (event: name\ndata: json\n\n)
    const event = parseSSE(value);
    callbacks.onEvent(event);
  }
  
  callbacks.onComplete();
};
```

---

## Important Configuration Files

### `package.json`

**What is it?** 

Declares dependencies and scripts. Think of it as a combination of:
- `requirements.txt` (Python) - lists dependencies
- `Makefile` or `package.json` scripts (Node.js) - defines commands
- `pom.xml` (Java) or `Cargo.toml` (Rust) - project metadata

**Key sections:**

```json
{
  "scripts": {
    "dev": "vite",              // Start dev server
    "build": "tsc -b && vite build",  // Build for production
    "preview": "vite preview"   // Preview production build locally
  },
  "dependencies": {
    "react": "^19.2.0",         // UI library
    "react-dom": "^19.2.0"      // React DOM renderer
  },
  "devDependencies": {
    "vite": "^7.2.2",           // Build tool
    "typescript": "~5.9.3",     // Type system
    "tailwindcss": "^3.4.15",   // CSS framework
    "@types/react": "^19.2.2"   // TypeScript types for React
  }
}
```

**Dependency versions:**
- `^19.2.0`: Install 19.2.0 or any compatible newer version (up to 20.0.0)
- `~5.9.3`: Install 5.9.3 or any patch version (up to 5.10.0)
- Exact version: `5.9.3` (no prefix)

### `tsconfig.json`

**What is it?**

TypeScript compiler configuration. Tells the TypeScript compiler how to process your code.

**Key settings:**

```json
{
  "compilerOptions": {
    "target": "ES2020",           // Compile to ES2020 JavaScript
    "module": "ESNext",           // Use modern ES modules
    "strict": true,               // Enable all strict type checking
    "jsx": "react-jsx",           // How to handle JSX syntax
    "moduleResolution": "bundler" // Module resolution strategy
  }
}
```

**Why multiple tsconfig files?**
- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: Settings for app code (src/)
- `tsconfig.node.json`: Settings for config files (vite.config.ts)

### `vite.config.ts`

**What is it?**

Vite build tool configuration.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],  // Enables React JSX transformation
})
```

**Common settings** (not used in this project but good to know):
```typescript
{
  server: {
    port: 3000,              // Dev server port
    proxy: {                 // Proxy API requests
      '/api': 'http://localhost:8000'
    }
  },
  build: {
    outDir: 'dist',          // Output directory
    sourcemap: true          // Generate source maps
  }
}
```

### `.env`

**What is it?**

Environment variables for different deployment environments.

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Or for production:
# VITE_API_BASE_URL=https://api.production.com
```

**Important:**
- Vite only exposes variables prefixed with `VITE_`
- Access in code: `import.meta.env.VITE_API_BASE_URL`
- Different from Node.js: `process.env.VAR_NAME` won't work
- Create `.env.local` for local overrides (add to .gitignore)

---

## Development Commands

### `npm install`

**What it does:** Installs all dependencies listed in `package.json`

**When to run:**
- After cloning the repository
- After pulling changes that update dependencies
- After manually editing `package.json`

**Similar to:**
- `pip install -r requirements.txt` (Python)
- `bundle install` (Ruby)
- `composer install` (PHP)
- `go mod download` (Go)

### `npm run dev`

**What it does:** Starts the Vite development server

**Features:**
- Hot Module Replacement (HMR): Changes appear instantly without page reload
- TypeScript compilation with error reporting
- Tailwind CSS processing
- Usually runs on `http://localhost:5173`

**Similar to:**
- `python manage.py runserver` (Django)
- `rails server` (Rails)
- `npm run start` (Create React App)

**Output:**
```
VITE v7.2.2  ready in 543 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### `npm run build`

**What it does:** Creates an optimized production build

**Process:**
1. TypeScript compilation (type checking + transpilation)
2. Tree-shaking (removes unused code)
3. Minification (reduces file size)
4. Code splitting (breaks into smaller chunks)
5. Asset hashing (cache busting)
6. Outputs to `dist/` directory

**Result:**
```
dist/
├── index.html
└── assets/
    ├── index-Csn48NP2.js   (bundled JS with content hash)
    └── index-UUK8w3Bz.css  (bundled CSS with content hash)
```

**Deploy:** Upload the `dist/` directory to any static file server (Nginx, Apache, Netlify, Vercel, S3, etc.)

### `npm run preview`

**What it does:** Serves the production build locally for testing

**When to use:**
- Test production build before deploying
- Verify optimization and bundling worked correctly
- Check that environment variables are correct

**Similar to:**
- Running your backend with production settings locally
- `NODE_ENV=production npm start`

---

## Key Concepts for Backend Developers

### 1. Everything Runs in the Browser (Client-Side)

Unlike server-side rendering (SSR) frameworks:
- **No server processing**: All React code runs on the user's device
- **Static files**: After build, you get HTML/CSS/JS files
- **API calls**: Frontend makes requests to your backend API
- **State is ephemeral**: Refresh the page = lose all state (unless using localStorage)

**Implication:** 
- Can't access databases directly
- Can't read server filesystem
- Can't execute server-side code
- Must call your backend API for data

### 2. Components Re-render When State Changes

React's core concept is **reactive rendering**:

```typescript
// When count changes, React automatically re-renders
const [count, setCount] = useState(0);

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      Increment
    </button>
  </div>
);
```

**Think of it like:**
- Calling `render()` automatically when data changes
- No manual DOM manipulation needed
- React efficiently updates only what changed

### 3. Hooks Are Like Service Dependencies

In React, hooks are functions that let you "hook into" React features:

```typescript
// useChat hook is like injecting a ChatService
const {
  messages,
  sendMessage,
  isLoading
} = useChat();
```

**Common hooks:**
- `useState`: Declare reactive state
- `useEffect`: Run side effects (like componentDidMount)
- `useCallback`: Memoize functions
- `useRef`: Hold mutable values that don't trigger re-renders

**Custom hooks** (like `useChat`):
- Encapsulate reusable logic
- Like services or utility classes
- Can use other hooks internally

### 4. API Calls Are Asynchronous

All API calls use promises (async/await):

```typescript
// Modern async/await syntax
const response = await fetch('/api/chat/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const json = await response.json();
```

**Similar to:**
- `requests.post()` in Python (with async libraries)
- `http.Post()` in Go
- `HttpClient.post()` in C#

### 5. TypeScript Provides Compile-Time Safety

TypeScript catches errors before runtime:

```typescript
interface User {
  id: string;
  name: string;
}

// ✅ Type-safe
const user: User = { id: '1', name: 'Alice' };

// ❌ TypeScript error: Property 'email' does not exist
console.log(user.email);

// ✅ TypeScript knows response shape
const response: StartTextChatResponse = await startTextChat(config);
console.log(response.thread_id);  // ✅ Valid
console.log(response.threadId);   // ❌ TypeScript error
```

### 6. Frontend State Management

**State** in React is like session data in backend, but:
- Lives in memory (lost on page refresh)
- Causes UI updates when changed
- Managed per-component or globally

**State management approaches:**

```typescript
// Component-level state (useState)
const [count, setCount] = useState(0);

// Custom hook state (shared logic)
const { messages, sendMessage } = useChat();

// Global state (Context API, Redux, Zustand)
// Not used in this project, but common for larger apps
```

**Persistence options:**
- `localStorage`: Save to browser storage (survives refresh)
- `sessionStorage`: Save for current tab session
- Cookies: Small data, sent with every request
- Backend API: Source of truth for important data

---

## Common Pitfalls and Gotchas

### 1. CORS Issues

**Problem:** Browser blocks API requests from `localhost:5173` to `localhost:8000`

**Why:** Cross-Origin Resource Sharing (CORS) security policy

**Solution:** Backend must send CORS headers:
```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Environment Variables

**Problem:** `process.env.API_URL` is undefined

**Why:** Vite uses `import.meta.env`, not `process.env`

**Solution:**
```typescript
// ❌ Wrong (Node.js style)
const apiUrl = process.env.VITE_API_BASE_URL;

// ✅ Correct (Vite style)
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### 3. State Updates Are Asynchronous

**Problem:** State doesn't update immediately

```typescript
const [count, setCount] = useState(0);

setCount(count + 1);
console.log(count);  // Still 0, not 1!
```

**Why:** React batches state updates for performance

**Solution:** Use the updated value in the next render or use a callback

### 4. Infinite Re-render Loops

**Problem:** Component keeps re-rendering forever

**Cause:** Setting state during render without conditions

```typescript
// ❌ Causes infinite loop
function BadComponent() {
  const [count, setCount] = useState(0);
  setCount(count + 1);  // Called every render!
  return <div>{count}</div>;
}

// ✅ Correct: Use useEffect or event handlers
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, []);  // Only run once on mount
  
  return <div>{count}</div>;
}
```

### 5. Missing Dependencies in useEffect

**Problem:** Stale closures causing bugs

```typescript
// ❌ Warning: missing dependency
useEffect(() => {
  console.log(messages);
}, []);  // Should include 'messages'

// ✅ Correct
useEffect(() => {
  console.log(messages);
}, [messages]);
```

---

## Testing the Application

### Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8000" > .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:5173
   ```

### Building for Production

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Deploy `dist/` directory:**
   - Upload to static hosting (Netlify, Vercel, S3, etc.)
   - Or serve with Nginx/Apache

### Verifying Backend Integration

1. **Check network requests** (Browser DevTools → Network tab):
   - POST to `/api/chat/text` should return 200
   - Response should match expected JSON structure
   - SSE connections should stay open during streaming

2. **Check console logs** (Browser DevTools → Console tab):
   - No CORS errors
   - No TypeScript errors
   - API responses logged correctly

3. **Test features:**
   - Start session → Should receive AI greeting
   - Send text message → Should see streaming response
   - Record audio → Should see transcription + response

---

## Summary: Frontend vs Backend Mental Model

| Frontend (React) | Backend Equivalent | Notes |
|------------------|-------------------|-------|
| Component | View/Template | Returns UI markup |
| Hook | Service/Use Case | Business logic |
| State | Session data | In-memory, ephemeral |
| Props | Function parameters | Data passed to components |
| useEffect | Lifecycle hooks | Run code on mount/update/unmount |
| API call | HTTP client | Fetch data from backend |
| TypeScript interface | DTO/Model | Data structure contract |
| JSX | Template syntax | HTML-like syntax in JavaScript |
| React Router | URL router | Client-side routing |
| Context API | Dependency injection | Share data across components |
| npm | pip/composer/cargo | Package manager |
| package.json | requirements.txt | Dependency manifest |
| node_modules/ | vendor/ | Installed packages |
| dist/ | build/ | Compiled output |
| Vite | webpack/babel | Build tool |

---

## Additional Resources

### Official Documentation
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

### Key Concepts to Learn
1. **React Fundamentals**: Components, props, state, hooks
2. **TypeScript Basics**: Types, interfaces, generics
3. **Async JavaScript**: Promises, async/await, fetch API
4. **Modern JavaScript**: ES6+ features (arrow functions, destructuring, modules)
5. **Browser APIs**: DOM manipulation, localStorage, MediaRecorder

### Debugging Tips
- Use React DevTools browser extension
- Use TypeScript strict mode for better error messages
- Check Network tab for API request/response details
- Use console.log liberally (or use debugger)
- Read browser console errors carefully

---

## Questions? Common Scenarios

### "How do I change the backend URL?"

Edit `.env` file:
```bash
VITE_API_BASE_URL=https://api.yourbackend.com
```

### "How do I add a new API endpoint?"

1. Add function to `src/lib/api.ts`:
```typescript
export const getProfile = async (): Promise<Profile> => {
  const response = await fetch(toUrl('/api/profile'));
  return await response.json();
};
```

2. Use in component/hook:
```typescript
const profile = await getProfile();
```

### "How do I add a new field to the chat config?"

1. Update type in `src/types/chat.ts`:
```typescript
export interface ChatConfig {
  // ... existing fields
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

2. Update API call in `src/lib/api.ts`:
```typescript
body: buildJsonBody({
  // ... existing fields
  difficulty: config.difficulty,
}),
```

3. Update UI in `src/App.tsx`:
```tsx
<select value={form.difficulty} onChange={handleField('difficulty')}>
  <option>easy</option>
  <option>medium</option>
  <option>hard</option>
</select>
```

### "How do I handle authentication?"

Common approaches:
1. **JWT tokens**: Store in localStorage, include in API headers
2. **Cookies**: Set by backend, automatically sent with requests
3. **OAuth**: Redirect flow, store access token

Example with JWT:
```typescript
// Store token
localStorage.setItem('token', tokenFromBackend);

// Include in requests
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

**You now have a comprehensive understanding of this React frontend!** 

The key takeaway: **TypeScript/React handles logic and UI, Vite builds it, Tailwind styles it, and everything runs in the browser making API calls to your backend.**

