# Code Standards Validation

When invoked with `/validate-code [file]`, check:

## TypeScript Standards
- [ ] No `any` types (use proper types)
- [ ] All functions have return type annotations
- [ ] All props have TypeScript interfaces
- [ ] Enums used for constants (not magic strings)

## React Standards
- [ ] Components use TypeScript + .tsx extension
- [ ] Server components by default (add 'use client' only if needed)
- [ ] Props destructured in function signature
- [ ] Use semantic HTML elements
- [ ] Accessibility: ARIA labels where needed

## Next.js Specific
- [ ] Use `next/image` for images (not `<img>`)
- [ ] Use `next/link` for internal links
- [ ] Metadata in layout.tsx or page.tsx
- [ ] API routes return proper Response objects

## File Organization
- [ ] One component per file
- [ ] Component name matches file name
- [ ] Grouped imports: React → Next.js → External → Internal
- [ ] Utility functions in `/lib` or `/utils`

## Naming Conventions
- Components: PascalCase (BusinessCard.tsx)
- Utils/hooks: camelCase (useBusinessSearch.ts)
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case or Tailwind utilities

Run ESLint and Prettier before marking as complete.