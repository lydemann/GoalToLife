const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/libs/app-lib/features/plan',
    '<rootDir>/libs/app-lib/shared/app-shared',
    '<rootDir>/apps/app',
    '<rootDir>/libs/shared/utils',
  ],
};
