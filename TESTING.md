# Testing Guidelines

This project uses Jest and React Testing Library for comprehensive test coverage. Tests are required for all code changes to ensure quality and maintainability.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI/CD (as in GitHub Actions)
npm run test:ci
```

## Test Structure

Tests are organized in the `__tests__` directory mirroring the source structure:

```
__tests__/
├── api/           # API route tests
│   └── search.test.ts
└── pages/         # Page component tests
    └── home.test.tsx
```

## Writing Tests

### Example: API Endpoint Test

```typescript
describe('Search API', () => {
  it('should return businesses matching the query', async () => {
    const response = await fetch('/api/search?query=Sparkle')
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.data).toBeInstanceOf(Array)
  })
})
```

### Example: Component Test

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

describe('Homepage', () => {
  it('should display business cards', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Sparkle Clean')).toBeInTheDocument()
    })
  })
})
```

## Test Coverage Requirements

When making changes to the codebase:

1. **Always write tests** for new features and bug fixes
2. **Update existing tests** when modifying behavior
3. **Run tests before committing** - the pre-commit hook enforces this
4. **Aim for meaningful coverage** - focus on important user flows rather than 100% line coverage

## Pre-commit Hook

The pre-commit hook automatically:
- ✅ Detects if you modified source files without adding tests
- ✅ Warns you if tests are missing and asks for confirmation
- ✅ Runs tests for changed files before allowing the commit
- ✅ Blocks commits if tests fail

To commit code without tests (not recommended):
1. The hook will warn you
2. Type "y" or "yes" when prompted
3. Your commit will proceed

## CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs tests on Node 18.x and 20.x
- ✅ Generates coverage reports
- ✅ Uploads coverage to Codecov
- ✅ Blocks merging if tests fail

## Key Testing Utilities

### React Testing Library
- `render()` - Render a component for testing
- `screen` - Query elements rendered on screen
- `waitFor()` - Wait for async operations
- `userEvent` - Simulate user interactions

### Jest
- `describe()` - Group related tests
- `it()` - Define individual tests
- `expect()` - Make assertions
- `jest.mock()` - Mock modules and functions
- `beforeEach()` - Setup before each test

## Testing Best Practices

1. **Test user behavior, not implementation details**
   - Test what users see and interact with
   - Avoid testing internal state or component methods

2. **Use meaningful test descriptions**
   - ✅ "should display error message when search fails"
   - ❌ "test error handling"

3. **Mock external dependencies**
   - Mock API calls, authentication, and external services
   - Use `jest.mock()` for modules

4. **Keep tests focused**
   - One test should verify one behavior
   - Use multiple small tests instead of one large test

5. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Error states
   - Boundary conditions

## Common Testing Patterns

### Mocking Fetch Calls
```typescript
global.fetch = jest.fn()

global.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: [] })
})
```

### Waiting for Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### User Interactions
```typescript
const user = userEvent.setup()
const button = screen.getByRole('button')
await user.click(button)
```

### Testing with Session
```typescript
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { id: '1', email: 'test@example.com' } },
    status: 'authenticated'
  }))
}))
```

## Troubleshooting

### Tests Not Running
- Check that you're in the project root directory
- Ensure all dependencies are installed: `npm install`
- Check that jest.config.ts exists

### Module Not Found Errors
- Verify path aliases in jest.config.ts match tsconfig.json
- Ensure files are in the correct directories

### Mock Issues
- Call `jest.clearAllMocks()` in beforeEach
- Verify mocks are set up before component renders

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
