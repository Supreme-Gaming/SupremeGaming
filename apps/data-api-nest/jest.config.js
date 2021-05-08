module.exports = {
  name: 'data-api-nest',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/data-api-nest',
};
