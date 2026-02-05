# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # Install deps, generate Prisma client, run migrations
npm run dev         # Start dev server with Turbopack (localhost:3000)
npm run build       # Build for production
npm run test        # Run tests with Vitest
npm run test -- src/lib/__tests__/file-system.test.ts  # Run single test file
npm run lint        # Run ESLint
npm run db:reset    # Reset database (use --force to skip confirmation)
```

## Architecture

UIGen is an AI-powered React component generator. Users describe components in chat, Claude generates them, and they render in a live preview.

### Key Data Flow

1. **Chat API** (`src/app/api/chat/route.ts`) - Receives messages, reconstructs VirtualFileSystem from serialized state, streams Claude responses with tool calls
2. **AI Tools** - Claude uses `str_replace_editor` (create/view/edit files) and `file_manager` (rename/delete) to manipulate the virtual filesystem
3. **Virtual File System** (`src/lib/file-system.ts`) - In-memory filesystem that holds generated code; serialized to DB for persistence
4. **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`) - Uses Babel to transform JSX to ES modules, creates blob URLs for import map, handles third-party packages via esm.sh
5. **Preview** (`src/components/preview/PreviewFrame.tsx`) - Renders components in sandboxed iframe using import maps; loads Tailwind from CDN

### React Context State

- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`) - Wraps VirtualFileSystem, provides `handleToolCall` to process AI tool responses
- **ChatContext** (`src/lib/contexts/chat-context.tsx`) - Manages chat messages and streaming state

### Provider System

- With `ANTHROPIC_API_KEY`: Uses Claude Haiku 4.5 via `@ai-sdk/anthropic`
- Without API key: Falls back to `MockLanguageModel` that returns static component code

### Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (chat interface, code editor, preview, auth)
- `src/lib/` - Core utilities: file-system, auth, AI provider, tools, prompts
- `src/actions/` - Server actions for project CRUD
- `prisma/schema.prisma` - SQLite database with User and Project models

### Code Style

- Use comments sparingly. Only comment complex code.

### Generated Code Conventions

The AI generates React components following these rules (from `src/lib/prompts/generation.tsx`):
- Root file must be `/App.jsx` with default export
- Style with Tailwind CSS, not inline styles
- Import local files with `@/` alias (e.g., `@/components/Button`)
- No HTML files - `App.jsx` is the entrypoint

### Database

SQLite via Prisma. Reference `prisma/schema.prisma` for the full schema. Projects store:
- `messages`: JSON string of chat history
- `data`: JSON string of serialized VirtualFileSystem state
