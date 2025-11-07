# Nashville Cleaning Directory - Development Instructions

## Mandatory Checks Before Completing Any Task

### 1. SEO Checklist (MUST verify before marking complete)
When creating or editing any page:
- [ ] Run `/check-seo [file]` and fix all issues
- [ ] Verify metadata is present and optimized
- [ ] Confirm proper heading hierarchy
- [ ] Add structured data if applicable

### 2. Testing Requirements (MUST complete before marking done)
For any new feature or component:
- [ ] Run `/verify-tests [feature]` 
- [ ] Write tests BEFORE marking task complete
- [ ] Ensure minimum 80% coverage
- [ ] All tests must pass: `npm test`

### 3. Code Quality (MUST verify)
Before committing code:
- [ ] Run `/validate-code [file]`
- [ ] Fix all ESLint errors: `npm run lint`
- [ ] Format with Prettier: `npm run format`
- [ ] No TypeScript errors: `npm run type-check`

### 4. Performance Standards
- [ ] Images optimized and using next/image
- [ ] Lazy loading for below-fold content
- [ ] No console.logs in production code
- [ ] API responses cached appropriately

## Workflow
1. Write code
2. Write tests (minimum 80% coverage)
3. Run `/validate-code` and fix issues
4. Run `/check-seo` if page component and fix issues
5. Run all tests: `npm test`
6. Run linter: `npm run lint`
7. Only then mark task as complete

## If You Skip These Steps
I (the user) will reject the PR and ask you to redo it properly.
