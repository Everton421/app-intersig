module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*)',
      ],
    setupFiles: [
        './jest.setup.js',
    ],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1',
    },
    modulePaths: ['<rootDir>'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{ts,tsx,js,jsx}',
      '!src/**/__mocks__/**',
      '!src/types/**',
      '!src/**/*.stories.{ts,tsx}',
      '!src/**/index.{ts,tsx}',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
  };