# Agent Guidelines for kick-italia

## Project Overview

- **Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Testing**: Vitest with jsdom
- **Linting**: ESLint with TypeScript
- **Backend**: Supabase (authentication, database)

## Build / Lint / Test Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Build
npm run build            # Production build
npm run build:dev        # Development build with source maps

# Linting
npm run lint             # Run ESLint on entire project
npx eslint src/file.ts   # Lint specific file

# Testing
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
npx vitest run src/test/example.test.ts  # Run single test
npx vitest run src/components/VideoPreviewCard.test.tsx
npx vitest run src/hooks/use-auth.test.ts
npx vitest run src/lib/utils.test.ts
npm run test:coverage    # Run tests with coverage
npm run preview          # Preview production build
```

## Code Style Guidelines

### TypeScript
- Use explicit typing for function parameters/return types when not obvious
- Use `type` for unions/interfaces, `interface` for object shapes
- Prefer `const` over `let`, avoid `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safety

### Imports
- Use path alias `@/*` (e.g., `@/components/Button`, `@/lib/utils`)
- Order: external libs → internal aliases → relative
- Named imports: `import { thing } from "module"`
- React namespace: `import * as React from "react"`

### Components
- Functional components with hooks
- Follow shadcn/ui patterns: compound components with CVA variants
- Use `React.forwardRef` for components accepting refs
- Export components and variant configs separately

### Naming Conventions
- **Components**: PascalCase (e.g., `VideoPreviewCard`, `Button`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `useVideos`)
- **Files**: PascalCase for components, camelCase for utilities/hooks
- **CSS Classes**: kebab-case (Tailwind)
- **Constants**: SCREAMING_SNAKE_CASE

### Tailwind CSS
- Use `cn()` utility from `@/lib/utils` for class merging
- Custom theme colors: `kick-navy`, `kick-sky`, `kick-green`, `kick-red`, `italia-green`, `italia-white`, `italia-red`
- Semantic colors: `primary`, `secondary`, `muted`, `accent`, `destructive`
- Custom fonts: `font-heading`, `font-body`, `font-nav`

```tsx
<button className={cn("bg-primary text-primary-foreground hover:bg-primary/90", className)}>
```

### Error Handling
- Use try/catch for async operations
- Display errors with toast/notification system
- Provide fallback UIs for error states
- Throw descriptive errors in custom hooks

### Testing
- Test files: `*.test.ts` or `*.spec.ts` (same dir or `src/test/`)
- Vitest globals: `describe`, `it`, `expect`
- `@testing-library/react` for component testing
- Test setup: `src/test/setup.ts` (jsdom)

### File Organization
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── *.tsx         # Feature components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, types, mock data
├── integrations/     # External services (Supabase)
├── contexts/         # React contexts
├── pages/ or routes/ # Page components
└── test/             # Test setup and files
```

### State Management
- React Context for global state (auth, theme)
- `@tanstack/react-query` for server state/data fetching
- Local state (`useState`) for component-level state

### Accessibility
- Use Radix UI primitives (accessible by default)
- Include `aria-label` for icon-only buttons
- Ensure keyboard navigation works
- Use semantic HTML elements

### Don'ts
- Do NOT use `any` type unless absolutely necessary
- Do NOT disable ESLint rules without good reason
- Do NOT commit secrets/credentials to the repo
- Do NOT use inline styles (use Tailwind classes)
- Do NOT mix different state management approaches unnecessarily

## Supabase Integration
- Used for Authentication, Database (PostgreSQL), and Edge Functions
- Client initialized in `src/integrations/supabase/client.ts`
- Database types in `src/integrations/supabase/types.ts`
- Queries wrapped in custom hooks (e.g., `src/hooks/`) with `@tanstack/react-query`

## Edge Functions
4 Supabase Edge Functions (Deno) in `supabase/functions/`:
1. `sync-rss-feeds` - Fetches/parses RSS, extracts data, maps club tags, upserts articles
2. `sync-youtube-videos` - Reads YouTube channels, filters new videos, maps tags, checks embeddability, upserts videos
3. `sync-league-standings` - Fetches Serie A Wikipedia page, parses standings, maps team names, overwrites table
4. `sync-clubs-wikipedia` - Run yearly to fetch Serie A/B teams for updating mock data