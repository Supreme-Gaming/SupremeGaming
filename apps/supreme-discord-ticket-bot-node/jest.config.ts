/* eslint-disable */
export default {
  displayName: 'supreme-discord-ticket-bot-node',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/supreme-discord-ticket-bot-node',
  preset: '../../jest.preset.js',
};
