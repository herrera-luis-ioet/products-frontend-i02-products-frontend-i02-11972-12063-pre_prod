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

## Environment Variables

Create a `.env` file in the project root with these variables:

```
REACT_APP_API_URL=<products-api-endpoint>
REACT_APP_ENV=development|production
```

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
