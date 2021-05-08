module.exports = {
  displayName: 'app-lib',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        'jest-preset-angular/build/InlineFilesTransformer': true,
        'jest-preset-angular/build/StripStylesTransformer': true
      }
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/app-lib',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  roots: ["<rootDir>/src/"]
};
