# AGENTS.md

## Build Commands
**Backend:** `cd backend && mvn clean package` (Java 17, Spring Boot, Maven)
**Frontend:** `cd frontend && npm run dev` (Next.js 16, TypeScript 5)
**Lint:** Frontend: `npm run lint` (ESLint + TypeScript)

## Code Style Guidelines
**Backend (Java):** Use Lombok `@RequiredArgsConstructor`, `@Data`, `@Builder`. Wrap responses in `Result<T>`. Use `@Valid` for validation. Catch exceptions at controller level with try-catch returning `Result.error()`.

**Frontend (TypeScript/React):** Use `"use client"` for client components. Use Zustand for state management. Follow shadcn/ui patterns with Radix UI primitives. Use `cn()` utility from `@/lib/utils` for class merging. Use Lucide React icons. Prefer functional components with hooks.

**Naming:** Components PascalCase, variables camelCase, constants UPPER_SNAKE_CASE. Use TypeScript interfaces for types.

**Formatting:** Prettier handles formatting (standard config). No comments unless explaining complex logic.
