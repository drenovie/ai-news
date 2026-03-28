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
npm run build            # Production build (outputs to dist/)
npm run build:dev        # Development build with source maps

# Linting
npm run lint             # Run ESLint on entire project
npx eslint src/file.ts   # Lint specific file

# Testing
npm run test             # Run all tests once (Vitest)
npm run test:watch       # Run tests in watch mode

# Run single test file
npx vitest run src/test/example.test.ts
npx vitest run src/components/VideoPreviewCard.test.tsx

# Preview production build
npm run preview
```

## Code Style Guidelines

### TypeScript

- Use explicit typing for function parameters and return types when not obvious
- Use `type` for unions/interfaces, `interface` for object shapes
- Prefer `const` over `let`, avoid `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safety
- Disable strict mode in tsconfig (`strict: false`), but write type-safe code anyway

### Imports

- Use path alias `@/*` for imports (e.g., `@/components/Button`, `@/lib/utils`)
- Order imports: external libs → internal aliases → relative
- Use `import { thing } from "module"` for named imports
- Use `import * as React from "react"` for React namespace

```typescript
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import "./local.css";
```

### Components

- Use functional components with hooks
- Follow shadcn/ui patterns: compound components with CVA variants
- Use `React.forwardRef` for components that accept refs
- Export components and variant configs separately

```typescript
// Example component pattern (shadcn/ui style)
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center...", {
  variants: {
    variant: { default: "...", destructive: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "...", icon: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Naming Conventions

- **Components**: PascalCase (e.g., `VideoPreviewCard`, `Button`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `useVideos`)
- **Files**: PascalCase for components, camelCase for utilities/hooks
- **CSS Classes**: kebab-case (Tailwind)
- **Constants**: SCREAMING_SNAKE_CASE for config/constants

### Tailwind CSS

- Use `cn()` utility from `@/lib/utils` for class merging
- Follow custom theme colors: `kick-navy`, `kick-sky`, `kick-green`, `kick-red`, `italia-green`, `italia-white`, `italia-red`
- Use semantic colors: `primary`, `secondary`, `muted`, `accent`, `destructive`
- Use `hsl()` variables for colors (defined in globals.css)
- Custom fonts: `font-heading`, `font-body`, `font-nav`

```tsx
<button className="cn("bg-primary text-primary-foreground hover:bg-primary/90", className)">
```

### Error Handling

- Use try/catch for async operations
- Display errors with toast/notification system
- Provide fallback UIs for error states
- Throw descriptive errors in custom hooks

```typescript
if (!context) {
  throw new Error("useAuth must be used within an AuthProvider");
}
```

### Testing

- Test files: `*.test.ts` or `*.spec.ts` in same directory or `src/test/`
- Use Vitest globals: `describe`, `it`, `expect`
- Use `@testing-library/react` for component testing
- Test location: `src/test/setup.ts` (jsdom environment)

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("ComponentName", () => {
  it("should render correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected")).toBeInTheDocument();
  });
});
```

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

- Use React Context for global state (auth, theme)
- Use `@tanstack/react-query` for server state/data fetching
- Use local state (`useState`) for component-level state

### Accessibility

- Use Radix UI primitives (they're accessible by default)
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

- Supabase is used for Authentication, Database (PostgreSQL), and Edge Functions.
- The client instance is initialized in `src/integrations/supabase/client.ts`.
- Database types (auto-generated) are located in `src/integrations/supabase/types.ts`.
- Supabase queries are wrapped in custom hooks (e.g., in `src/hooks/`) and typically utilize `@tanstack/react-query` to manage caching and loading states.

## Edge Functions

The project utilizes 4 Supabase Edge Functions (running on Deno) to sync data from external sources. They are located in `supabase/functions/`:

1. **`sync-rss-feeds`**:
   - Fetches active feeds from the `rss_feeds` table, parses XML/RSS data, and extracts titles, text, images, and publish dates.
   - Intelligently detects and maps club tags (like Milan, Inter, Juve, etc.) and upserts the articles into the `articles` table.
2. **`sync-youtube-videos`**:
   - Reads active YouTube channels from the `video_channels` table and pulls their XML feeds.
   - Filters new videos, maps club tags using a robust dictionary of aliases, checks YouTube oEmbed for embeddability, and upserts to the `videos` table.
3. **`sync-league-standings`**:
   - Fetches the current Serie A Wikipedia page HTML.
   - Parses the HTML tables to extract standings data (position, played, won, goals, points), maps Wikipedia team names to internal club IDs, and overwrites the `league_standings` table.
4. **`sync-clubs-wikipedia`**:
   - Designed to be run manually once a year to fetch Serie A and Serie B team lists for the new season.
   - Parses the Wikipedia DOM and API to output a structured list of teams to assist in updating `src/lib/mock-data.ts`.
