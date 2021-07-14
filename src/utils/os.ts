import { exec as rawExec } from 'child_process';
import { ResultAsync } from 'neverthrow';
import { promisify } from 'util';

export const exec = (command: string) =>
	ResultAsync.fromPromise(
		promisify(rawExec)(command),
		() => new Error('[EXEC]: Unable to execute')
	);
