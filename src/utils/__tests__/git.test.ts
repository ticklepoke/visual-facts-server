import fs from 'fs';
import { Ok, okAsync } from 'neverthrow';
import path from 'path';
import { promisify } from 'util';
import { checkoutRepo, initRootFolder } from '../git';
import * as os from '../os';

const MOCK_DIR = path.resolve('/tmp/mock');
const rmdir = promisify(fs.rmdir);

describe('checkoutRepo', () => {
	let execSpy: jest.SpyInstance;

	beforeEach(() => {
		execSpy = jest.spyOn(os, 'exec').mockReturnValue(
			okAsync({
				stdout: 'mock',
				stderr: '',
			})
		);
	});

	afterEach(() => {
		execSpy.mockRestore();
	});

	it('should return ok() if repo does not exist', async () => {
		expect(await checkoutRepo('mockRepo', 'mockHash')).toBeInstanceOf(Ok);
	});

	it('should return ok() if repo already exists', async () => {
		const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);

		expect(await checkoutRepo('mockRepo', 'mockHash')).toBeInstanceOf(Ok);
		existsSyncSpy.mockRestore();
	});
});

describe('initRootFolder', () => {
	let existsSyncSpy: jest.SpyInstance;

	afterEach(async () => {
		existsSyncSpy.mockRestore();
		try {
			await rmdir(MOCK_DIR);
			// eslint-disable-next-line no-empty
		} catch (e) {}
	});

	it('should create a folder and return ok()', async () => {
		existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
		expect(await initRootFolder(MOCK_DIR)).toBeInstanceOf(Ok);
		expect(fs.readdirSync('/tmp/mock')).toEqual([]);
	});

	it('should return ok() if folder already exists and not execute mkdir', async () => {
		existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
		expect(await initRootFolder(MOCK_DIR)).toBeInstanceOf(Ok);
	});
});
