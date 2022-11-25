/* eslint-disable */
export default {
  displayName: 'ark-cacher-node',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/ark-cacher-node',
  preset: '../../jest.preset.js',
};
