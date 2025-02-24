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

The project uses Jest and React Testing Library for testing. Available test commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

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
