/* eslint-disable */
export default {
  displayName: 'agent',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  transformIgnorePatterns: ['node_modules/(?!public-ip/.*)'],
  coverageDirectory: '../../coverage/libs/agent',
};
