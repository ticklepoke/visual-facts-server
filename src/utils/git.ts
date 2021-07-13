import path from 'path';
import fs from 'fs';
import { execCommandAsync } from './os';

export async function checkoutRepo(repoUrl: string, commitHash: string) {
	const localDir = path.join('/tmp', repoUrl);
	// Check whether the repo has already been checked-out
	if (!fs.existsSync(localDir)) {
		await execCommandAsync(`git clone ${repoUrl} ${localDir}`);
	} else {
		await execCommandAsync(`cd ${localDir} && git fetch`);
	}
	// Go to that directory & checkout specific commit
	await execCommandAsync(`cd ${localDir} && git checkout ${commitHash}`);
	// Return path
	console.log({ localDir });
	return localDir;
}
