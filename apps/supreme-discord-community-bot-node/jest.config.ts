module.exports = {
  displayName: 'supreme-discord-community-bot-node',

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
  coverageDirectory: '../../coverage/apps/supreme-discord-community-bot-node',
  preset: '../../jest.preset.ts',
};
