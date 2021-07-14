import util from 'util';
import { Err, ok } from 'neverthrow';
import { mkdir } from '../fs';

describe('mkdir', () => {
	let promisifySpy: jest.SpyInstance;

	afterEach(() => {
		promisifySpy.mockRestore();
	});

	it('should return ok() if a promise resolves', async () => {
		promisifySpy = jest
			.spyOn(util, 'promisify')
			.mockImplementation(() => () => Promise.resolve('mockReturnValue'));

		expect(await mkdir('dummyDir')).toEqual(ok('mockReturnValue'));
	});

	it('should return err() if a promise rejects', async () => {
		promisifySpy = jest
			.spyOn(util, 'promisify')
			.mockImplementation(() => () => Promise.reject());

		expect(await mkdir('dummyDir')).toBeInstanceOf(Err);
	});
});
