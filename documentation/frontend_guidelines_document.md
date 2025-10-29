# StoreSync – Frontend Guidelines Document

This document describes the frontend setup for StoreSync, our unified e-commerce management platform. It explains how everything is structured, which technologies we use, and the principles guiding our design and development. Whether you’re new to the project or joining the team, these guidelines will help you understand and contribute to a consistent, high-quality user interface.

## 1. Frontend Architecture

**Framework & Language**
- Next.js 15 (App Router) for building pages, layouts, and API routes in a full-stack React environment.
- TypeScript for end-to-end type safety, reducing runtime errors and improving developer experience.

**UI & Styling**
- shadcn/ui as our component library foundation, offering accessible, pre-built React components.
- Tailwind CSS for utility-first styling and rapid UI development.

**State & Data Fetching**
- Zustand for client-side state management (lightweight, flexible stores).
- tRPC backed by Next.js App Router for type-safe remote procedure calls and server state.
- React Query (built into tRPC) handles caching, background updates, and stale-while-revalidate.

**Authentication & APIs**
- Clerk for user sign-up, login, and session management.
- tRPC endpoints reside alongside Next.js routes, offering an API gateway without extra boilerplate.

**Deployment & Performance**
- Vercel for hosting, automatic builds, and edge optimizations.
- GitHub Actions for CI/CD, running linting, type checks, tests, and deployments on each pull request.

**Scalability & Maintainability**
- App Router’s nested layouts keep related pages grouped by feature (stores, orders, analytics).
- Component-based structure encourages reuse, reduces duplication, and isolates changes.
- Type safety across UI, API calls, and database interactions (via Drizzle ORM) prevents mismatches.

## 2. Design Principles

We follow these guiding principles to ensure a user-friendly, robust product:

- **Usability**: Simple, clear interactions. Major actions (adding a store, syncing inventory, viewing reports) take as few clicks as possible.
- **Accessibility**: All interactive elements use semantic HTML and ARIA attributes. Keyboard navigation, screen-reader labels, and color-contrast checks are enforced.
- **Responsiveness**: Layouts adapt seamlessly from mobile to desktop. Breakpoints in Tailwind ensure components look good on any screen.
- **Consistency**: Shared styles and components maintain a unified experience across every page.
- **Performance-First**: Lazy-load non-critical code, optimize images, and minimize bundle size to keep interactions snappy.

## 3. Styling and Theming

**Approach**
- Utility-first via Tailwind CSS. We configure a central `tailwind.config.js` for colors, fonts, and breakpoints.
- No separate CSS preprocessors—Tailwind’s JIT engine covers our needs.

**Theming**
- Light and dark modes support, toggled via a top-level React context and CSS class on `<html>`.
- Theme variables (colors, shadows) defined in Tailwind’s theme section.

**Visual Style**
- Modern, flat design with slight shadows for depth.
- Clean panels, minimal borders, and spacious layouts.

**Color Palette**
- Primary: #1E40AF (indigo-700)  
- Secondary: #2563EB (blue-600)  
- Accent: #8B5CF6 (violet-500)  
- Background: #F9FAFB (gray-50) / #111827 (gray-900)  
- Surface: #FFFFFF (white) / #1F2937 (gray-800)  
- Text: #111827 (gray-900) / #F3F4F6 (gray-100)  
- Success: #10B981 (emerald-500)  
- Warning: #F59E0B (amber-500)  
- Error: #EF4444 (red-500)

**Font**
- Inter (system-level fallback: ui-sans-serif).
- Headings: 600–700 weight, Body: 400–500 weight.

## 4. Component Structure

**Organization**
- `app/` – Next.js pages and layout definitions by route.
- `components/` – Feature-specific, reusable pieces (e.g., `StoreCard`, `OrderList`).
- `ui/` – shadcn/ui overrides and shared primitives (buttons, inputs, modals).
- `hooks/` – Custom hooks (e.g., `useStoreSync`, `useTheme`).
- `state/` – Zustand store definitions and selectors.

**Best Practices**
- Each component folder includes its `.tsx`, `styles.ts` (if needed), and test file.
- Props are strongly typed; components focus on presentation, delegating data logic to hooks or state stores.
- High cohesion: related UI fragments live together, while global utilities live in their own folders.

## 5. State Management

**Client State**
- Zustand stores for UI state: theme mode, sidebar open/closed, filter selections.

**Server State**
- tRPC queries and mutations handle data fetching and updates.
- Queries cached via React Query; invalidated on mutations for fresh data.

**Patterns**
- Keep global stores lean—most data lives in tRPC queries.
- Encapsulate logic in custom hooks that combine state and API calls (e.g., `useInventory`).

## 6. Routing and Navigation

**Next.js App Router**
- File-based routing under `app/`. Example:
  - `/stores` – dashboard listing all connected stores.
  - `/stores/[storeId]/orders` – order management for a specific store.
  - `/analytics` – BI dashboards.

**Layouts & Templates**
- Shared layouts (`root/layout.tsx`, `dashboard/layout.tsx`) wrap pages with navigation chrome.
- Error boundaries (`error.tsx`) at route level to catch and display friendly messages.

**Client Links**
- Use Next.js `<Link>` for internal navigation with prefetching enabled by default.
- Active link highlighting via `usePathname` hook.

## 7. Performance Optimization

- **Route-Based Code Splitting**: Each page loads only its code and dependencies.
- **Dynamic Imports** for heavy components (charts, maps).
- **Image Optimization** with `next/image` for automatic resizing and WebP conversion.
- **Tailwind Purge** removes unused CSS in production builds.
- **Prefetching** key data on hover and idle time with React Query’s `prefetchQuery`.
- **Lighthouse Audits** integrated into CI to catch regressions in performance scores.

## 8. Testing and Quality Assurance

**Unit & Integration Tests**
- Vitest as the test runner, with `@testing-library/react` for component testing.
- Test files alongside components, following `ComponentName.test.tsx` convention.

**End-to-End Tests**
- We recommend using Playwright (or Cypress) for critical flows: login, store sync, order handling.
- E2E specs live under `tests/e2e/` with environment-matched fixtures.

**Linting & Formatting**
- ESLint with TypeScript plugin and shared Next.js rules.
- Prettier for consistent code style; enforced on every commit via Husky and `lint-staged`.

**Continuous Integration**
- GitHub Actions workflow runs type checks, linting, tests, and Lighthouse audits before merging.

## 9. Conclusion and Overall Frontend Summary

StoreSync’s frontend is built on modern, proven technologies—Next.js, TypeScript, Tailwind CSS, tRPC, and Zustand. Our architecture emphasizes:

- **Scalability** through modular design and route-based code splitting.
- **Maintainability** via component-based structure, strong typing, and clear folder organization.
- **Performance** by optimizing bundles, images, and data fetching strategies.
- **User-Centered Design** with accessibility, responsiveness, and consistency at its core.

By following these guidelines, contributors can build features that feel cohesive, perform reliably, and delight users across devices. Welcome to the StoreSync frontend team—let’s keep our interface fast, accessible, and easy to maintain!