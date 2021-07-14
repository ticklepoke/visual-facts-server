import { Err, ok } from 'neverthrow';
import { mavenBuild } from '../java';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const java = require('../java');

describe('mavenBuild', () => {
	let _mavenBuildSpy: jest.SpyInstance;

	afterEach(() => {
		_mavenBuildSpy.mockRestore();
	});

	it('should return ok() if a promise resolves', async () => {
		_mavenBuildSpy = jest
			.spyOn(java, '_mavenBuild')
			.mockImplementation(() => Promise.resolve('mockReturnValue'));

		expect(await mavenBuild('dummyPath')).toEqual(ok('mockReturnValue'));
	});

	it('should return a err() if a promise rejects', async () => {
		_mavenBuildSpy = jest
			.spyOn(java, '_mavenBuild')
			.mockImplementation(() => Promise.reject());

		expect(await mavenBuild('dummyPath')).toBeInstanceOf(Err);
	});
});
