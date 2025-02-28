module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  };