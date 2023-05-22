module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  verbose: true,
  bail: false,
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'ts',
    'vue',
    'js',
  ],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: [
    '<rootdir>/node_modules/',
    '<rootdir>/src/main.ts',
    '<rootdir>/src/router/index.ts',
    '<rootdir>/src/composable/*.ts',
  ],
  testMatch: [
      '<rootDir>/tests/unit/**/*.test.js',
      '!<rootDir>/tests/unit/Vue/*.test.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.vue',
    '!src/components/util/*.vue',
    '!src/components/AssignContent/*.vue',
    '!src/components/AssignRightBar/AssignButton.vue'
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: "<rootDir>/tests/unit/coverage",
  testURL: 'http://localhost/',
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  }
};