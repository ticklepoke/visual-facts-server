import { Err, ok } from 'neverthrow';
import util from 'util';
import { exec } from '../os';

describe('exec', () => {
	let execSpy: jest.SpyInstance;

	afterEach(() => {
		execSpy.mockRestore();
	});

	it('should return ok() if a promise resolves', async () => {
		execSpy = jest
			.spyOn(util, 'promisify')
			.mockImplementation(() => () => Promise.resolve('mockReturnValue'));

		expect(await exec('dummyPath')).toEqual(ok('mockReturnValue'));
	});

	it('should return a err() if a promise rejects', async () => {
		execSpy = jest
			.spyOn(util, 'promisify')
			.mockImplementation(() => () => Promise.reject());

		expect(await exec('dummyPath')).toBeInstanceOf(Err);
	});
});
