# Test Verification Command

When invoked with `/verify-tests [feature]`, ensure:

## Unit Tests Required
- [ ] All utility functions have tests
- [ ] Test file exists: `[component].test.tsx`
- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases (null, undefined, empty)
- [ ] Mock external dependencies (Airtable API, etc.)

## Integration Tests Required (if applicable)
- [ ] API routes have integration tests
- [ ] Database operations are tested
- [ ] Form submissions are tested

## Standards
- Use Jest + React Testing Library
- Minimum 80% code coverage
- Use descriptive test names: `it('should [expected behavior]')`
- Arrange-Act-Assert pattern

## Output
- Run tests: `npm test [file]`
- Show coverage: `npm run test:coverage [file]`
- List any missing tests