import fs from 'fs';
import { ResultAsync } from 'neverthrow';
import { promisify } from 'util';

export const mkdir = (dir: string) =>
	ResultAsync.fromPromise(
		promisify(fs.mkdir)(dir),
		() => new Error('[MKDIR]: Unable to execute')
	);
