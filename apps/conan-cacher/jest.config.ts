/* eslint-disable */
export default {
  name: 'conan-cacher',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/conan-cacher',
  testEnvironment: 'node',
};
