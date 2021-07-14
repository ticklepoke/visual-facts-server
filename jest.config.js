module.exports = {
	preset: 'ts-jest',
	testMatch: ['**/__tests__/**/*.(test).ts', '**/?(*.)+(test).ts'],
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules'],
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	collectCoverage: true,
};
