module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*integration.test.js'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testTimeout: 15000,
  verbose: true,
  maxWorkers: '50%'
}
