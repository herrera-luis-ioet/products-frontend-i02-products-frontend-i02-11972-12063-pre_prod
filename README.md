# Products Frontend I.0.2

A React-based frontend application for displaying and managing products, integrated with the Products-API-L backend service.

## Project Overview

This frontend application is built using modern web technologies to provide a responsive and intuitive user interface for product management. The application fetches product data from the Products-API-L service and displays it in an organized manner.

### Core Technologies

- **React.js**: Component-based UI framework
- **Webpack**: Module bundling and build optimization
- **Jest & React Testing Library**: Testing framework
- **AWS S3 & CloudFront**: Hosting and content delivery
- **GitHub Actions**: CI/CD pipeline

## Setup Instructions

1. **Prerequisites**
   - Node.js (LTS version recommended)
   - npm (comes with Node.js)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Navigate to project directory
   cd products-frontend-i02
   
   # Install dependencies
   npm install
   ```

## Development Guidelines

### Local Development

Start the development server:
```bash
npm start
```
This will run the application in development mode at [http://localhost:3000](http://localhost:3000)

### Project Structure
```
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── config/         # Configuration files
│   └── __tests__/      # Test files
├── public/            # Static files
└── dist/             # Production build output
```

## Testing

### Test Environment Setup

The project uses Jest and React Testing Library for comprehensive testing. The test environment is configured to handle both unit and integration tests effectively.

#### Prerequisites
- Node.js and npm installed
- All project dependencies installed (`npm install`)
- Understanding of React Testing Library patterns
- Familiarity with Jest testing framework

#### Test Configuration

The test environment is configured in `jest.config.js` with the following key features:

- **Test Environment**: 
  - JSDOM for browser-like environment
  - Simulates DOM APIs and browser behavior
  - Supports React component rendering and interactions

- **Setup Files**: 
  - `src/setupTests.js`: Global test setup and MSW configuration
  - `@testing-library/jest-dom`: Enhanced DOM testing utilities
  - Custom test environment cleanup between tests

- **File Mappings**:
  - CSS/SCSS files: Handled by identity-obj-proxy for style imports
  - Image files: Mocked via fileMock.js for asset imports
  - Static assets: Properly mocked to prevent test failures

- **Test Patterns and Organization**:
  - Unit tests: `**/__tests__/**/*.test.js`
    - Focus on individual component behavior
    - Isolated testing of functions and hooks
    - Mock external dependencies
  - Integration tests: `**/__tests__/**/*integration.test.js`
    - Test component interactions
    - Verify API integration
    - End-to-end workflow testing

- **Performance Configuration**:
  - Parallel test execution with maxWorkers set to 50%
  - Test timeout set to 15 seconds
  - Verbose output for detailed test results

- **Coverage Reports**: 
  - HTML reports for visual coverage analysis
  - LCOV format for CI/CD integration
  - Text output for quick command-line feedback
  - Coverage collection from all relevant source files

- **Available Test Scripts**:
  ```bash
  # Run all tests
  npm test

  # Run tests in watch mode
  npm run test:watch

  # Run with coverage report
  npm run test:coverage

  # Run integration tests only
  npm run test:integration

  # Run all tests with coverage and handle open handles
  npm run test:all

  # Run tests in CI environment
  npm run test:ci

  # Run tests in debug mode
  npm run test:debug
  ```

- **Test Environment Variables**:
  ```bash
  # Set in package.json scripts
  CI=true            # Non-interactive mode
  NODE_ENV=test     # Test environment
  ```

### MSW Configuration

Mock Service Worker (MSW) is used for API mocking in tests. It allows us to intercept network requests and provide mock responses, making our tests more reliable and independent of external services.

#### Installation

MSW is already included in the project dependencies. If you need to install it manually:

```bash
npm install msw --save-dev
```

#### Configuration

1. The MSW setup is located in `src/mocks/`:
   - `handlers.js`: Contains API request handlers
   - `server.js`: Sets up the MSW server for tests

2. Create handlers in `src/mocks/handlers.js`:
```javascript
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ])
    )
  })
]
```

3. Configure MSW in your tests:
```javascript
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

#### Usage Examples

1. Testing successful API responses:
```javascript
test('displays products from API', async () => {
  render(<ProductList />)
  
  // MSW will intercept the API call and return mock data
  const products = await screen.findAllByRole('article')
  expect(products).toHaveLength(2)
})
```

2. Testing error handling:
```javascript
test('displays error message on API failure', async () => {
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )
  
  render(<ProductList />)
  const errorMessage = await screen.findByText(/error loading products/i)
  expect(errorMessage).toBeInTheDocument()
})
```

#### Best Practices

1. Keep mock data realistic and consistent with API contracts
2. Use separate handler files for different API endpoints
3. Reset handlers after each test to prevent test pollution
4. Add specific handlers for error cases to test error handling
5. Use MSW's response transformers (ctx.status, ctx.json, etc.) to simulate various API responses
6. Keep mock data minimal but sufficient for testing requirements

For more details on MSW, visit the [official documentation](https://mswjs.io/).

### Running Integration Tests

Integration tests verify component interactions and API integrations:

```bash
# Run all tests (unit + integration)
npm test

# Run tests in watch mode
npm run test:watch

# Run only integration tests
npm test -- --testMatch="**/*integration.test.js"

# Generate test coverage report
npm run test:coverage
```

### Troubleshooting Common Issues

1. **Test Timeouts**
   - Default timeout is 15000ms
   - Increase timeout in jest.config.js if needed
   - Check for slow API responses or heavy computations

2. **JSDOM Related Issues**
   - Ensure DOM manipulation is wrapped in act()
   - Check for missing cleanup in useEffect
   - Verify proper event handling

3. **Mock Service Worker Issues**
   - Verify handler patterns match API calls
   - Check for proper server setup/teardown
   - Ensure handlers are properly reset between tests

4. **Coverage Issues**
   - Coverage reports are generated in ./coverage
   - Minimum coverage thresholds can be configured in jest.config.js
   - Use coverage reports to identify untested code

### Best Practices

1. **Test Organization**
   - Keep tests close to components in the same directory
   - Use descriptive test names that explain the test scenario
   - Group related tests using describe blocks
   - Follow the Arrange-Act-Assert pattern
   - Separate unit and integration tests clearly
   - Use test fixtures for complex test data

2. **Mocking and Test Data**
   - Mock external dependencies consistently
   - Use MSW for API mocking with realistic responses
   - Clean up mocks after each test
   - Create reusable mock factories
   - Keep test data minimal but sufficient
   - Use meaningful test data that represents real scenarios

3. **Assertions and Expectations**
   - Use specific assertions that clearly indicate intent
   - Test component behavior, not implementation details
   - Cover edge cases and error scenarios thoroughly
   - Test accessibility using RTL queries
   - Verify component states and transitions
   - Test user interactions and event handling

4. **Testing Patterns**
   - Use React Testing Library's user-centric queries
   - Prefer getByRole over getByTestId
   - Test components in isolation when possible
   - Verify component integration points
   - Test error boundaries and fallback UI
   - Include performance-critical test cases

5. **Code Quality**
   - Maintain DRY principles in test code
   - Use helper functions for common test operations
   - Document complex test scenarios
   - Follow consistent naming conventions
   - Keep test files organized and maintainable
   - Regular review and refactoring of test code

## Deployment Process

The application uses GitHub Actions for CI/CD and deploys to AWS infrastructure.

### Build Process
```bash
# Create production build
npm run build
```

### AWS Configuration

The application is deployed to:
- **AWS S3**: Static file hosting
- **CloudFront**: Content delivery network

### CI/CD Pipeline

The GitHub Actions workflow handles:
1. Code validation
2. Running tests
3. Building the application
4. Deploying to AWS
5. Cache invalidation

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Create production build
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate test coverage report

## Environment Configuration

### Environment Variables

Create a `.env` file in the project root with these variables:

```bash
# API Configuration
REACT_APP_API_URL=<products-api-endpoint>    # Required: URL of the Products-API-L service
REACT_APP_API_VERSION=v1                     # Optional: API version (default: v1)
REACT_APP_API_TIMEOUT=5000                   # Optional: API timeout in milliseconds (default: 5000)

# Environment Configuration
REACT_APP_ENV=development|production         # Required: Application environment
NODE_ENV=development|production              # Required: Node environment
PORT=3000                                    # Optional: Development server port (default: 3000)

# Feature Flags
REACT_APP_ENABLE_CACHE=true|false           # Optional: Enable API response caching (default: true)
REACT_APP_DEBUG_MODE=true|false             # Optional: Enable debug logging (default: false)
```

### Development Environment Setup

1. **Node.js Configuration**
   - Required version: Node.js 18.x or higher
   - Package manager: npm 8.x or higher
   ```bash
   # Verify installations
   node --version
   npm --version
   ```

2. **Development Tools**
   - Webpack Dev Server: Configured for hot reloading
   - Babel: Configured for React and modern JavaScript
   - PostCSS: For CSS processing and optimization
   ```bash
   # Install development dependencies
   npm install --save-dev
   ```

3. **Environment-Specific Configurations**
   
   #### Development
   ```bash
   # .env.development
   REACT_APP_ENV=development
   REACT_APP_API_URL=http://localhost:8080
   REACT_APP_DEBUG_MODE=true
   ```

   #### Production
   ```bash
   # .env.production
   REACT_APP_ENV=production
   REACT_APP_API_URL=https://api.products.example.com
   REACT_APP_ENABLE_CACHE=true
   REACT_APP_DEBUG_MODE=false
   ```

### Build Configuration

The project uses Webpack for building and bundling:

1. **Development Build**
   ```bash
   # Start development server with hot reloading
   npm start
   ```
   - Enables source maps
   - Includes development tools
   - No minification for better debugging

2. **Production Build**
   ```bash
   # Create optimized production build
   npm run build
   ```
   - Minifies and optimizes code
   - Generates source maps
   - Enables tree shaking
   - Optimizes images and assets

### Performance Optimization

The build process includes several optimization features:

- **Code Splitting**: Automatic chunk generation
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compresses images and CSS
- **Caching**: Implements cache busting
- **Compression**: Enables Gzip compression

### Troubleshooting

Common environment issues and solutions:

1. **API Connection Issues**
   - Verify REACT_APP_API_URL is correct
   - Check CORS configuration
   - Ensure API service is running

2. **Build Problems**
   - Clear node_modules and package-lock.json
   - Run `npm cache clean --force`
   - Reinstall dependencies

3. **Development Server Issues**
   - Check if port 3000 is available
   - Verify Node.js version compatibility
   - Clear browser cache

For additional environment configuration support, consult the DevOps team.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Submit a pull request

## AWS Configuration

### S3 Bucket Setup
- Enable static website hosting
- Configure bucket policy for public access
- Enable versioning

### CloudFront Configuration
- Point to S3 bucket as origin
- Enable HTTPS
- Configure caching behavior

For detailed deployment instructions, contact the DevOps team.
