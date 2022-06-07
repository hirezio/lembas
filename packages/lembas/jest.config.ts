/* eslint-disable */
export default {
  displayName: 'lembas',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: ['../../node_modules/@hirez_io/jest-single/dist/jest-single.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  resetMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageDirectory: '../../coverage/packages/lembas',
};
