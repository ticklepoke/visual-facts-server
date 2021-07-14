import fs from 'fs';
import { ResultAsync } from 'neverthrow';
import { promisify } from 'util';

export const mkdir = (dir: string) =>
	ResultAsync.fromPromise(
		promisify(fs.mkdir)(dir),
		() => new Error('[MKDIR]: Unable to execute')
	);

export const rmdir = (dir: string) =>
	ResultAsync.fromPromise(
		promisify(fs.rmdir)(dir),
		() => new Error('[RMDIR] Unable to execute')
	);

export const exists = (dir: string) =>
	ResultAsync.fromPromise(
		promisify(fs.exists)(dir),
		() => new Error('[EXISTS] Unable to execute')
	);
