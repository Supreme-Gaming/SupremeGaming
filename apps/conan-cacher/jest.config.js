module.exports = {
  name: 'conan-cacher',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/conan-cacher',
};
